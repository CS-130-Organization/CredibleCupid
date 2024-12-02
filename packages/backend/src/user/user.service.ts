import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, Not } from "typeorm";;

import { User, Referral, Gender, SexualOrientation } from "../database/entities";
import { ProfileValidator } from "../scripts/profileValidator";
import { Ok, Err, Result } from "ts-results";

import * as fs from "fs";



@Injectable()
export class UserService {
	constructor(private data_source: DataSource,
		@InjectRepository(User) private user_repository: Repository<User>,
	) { }

	async find_user_with_email(email: string): Promise<User | null> {
		return await this.user_repository.findOne({ where: { email } });
	}

	async create_user(email: string, password: string): Promise<User | null> {
		const existing = await this.find_user_with_email(email);
		if (existing && existing.credibility_score > 0) {
			return null;
		}

		return await this.user_repository.save({ email, password });
	}

	async update_user_bio(
		guid: string,
		first_name: string,
		last_name: string,
		bio: string,
		gender: Gender,
		pronouns: string,
		sexual_orientation: SexualOrientation,
		birthday_ms_since_epoch: number,
		height_mm: number,
		occupation: string
	): Promise<Result<User, string>> {
		return await this.data_source.transaction(async manager => {
			const user = await manager.findOne(User, { relations: { referrals: true }, where: { guid } });

			if (!user) {
				return Err("User does not exist!");
			}

			user.first_name = first_name;
			user.last_name = last_name;
			user.bio = bio;
			user.gender = gender;
			user.pronouns = pronouns;
			user.sexual_orientation = sexual_orientation;
			user.birthday = new Date(birthday_ms_since_epoch);
			user.height_mm = height_mm;
			user.occupation = occupation;
			console.log("user before cred score update: ", user);

			// calculate credibility score with text validation
			const probability = await ProfileValidator.validateText(user);
			console.log("generated credibility score (human probability): ", probability);
			
			user.credibility_score = probability;
			console.log("score assigned to user: ", user.credibility_score);

			await manager.save(User, user);

			if (user.gender == Gender.kMale) {
				const referrals = await manager.find(Referral, { relations: { user: true }, where: { email: user.email.toLowerCase() } })

				if (referrals.length < 3) {

					user.credibility_score = 0;
					await manager.save(User, user);

					return Err("Male user does not have enough referrals! You need to have at least 3 referrals in order to use CredibleCupid.");
				}

				// Remove all referrals if you are a male.
				user.referrals = [];
			}

			return Ok(user);
		});
	}

	async update_user_profile_pic(guid: string, file: Express.Multer.File): Promise<Result<null, string>> {
		return await this.data_source.transaction(async manager => {
			const user = await manager.findOne(User, { where: { guid } });

			if (!user) {
				return Err("User not found!");
			}

			const filename = user.guid + "." + file.originalname.split(".").pop();
			await fs.writeFile('/usr/uploaded/profiles/' + filename, file.buffer, { flag: "w+" }, err => {});

			user.profile_pic = filename;

			await manager.save(User, user);

			return Ok(null);
		});
	}

	async get_user_profile_pic(guid: string): Promise<Result<string, string>> {
		const user = await this.user_repository.findOne({ where: { guid } });

		if (!user) {
			return Err("User not found!");
		}

		if (!user.profile_pic) {
			return Err("Profile picture not set!");
		}

		return Ok('/usr/uploaded/profiles/' + user.profile_pic);
	}

	async find_user_with_guid(guid: string): Promise<User | null> {
		return await this.user_repository.findOne({ relations: { referrals: true },  where: { guid } });
	}

	async find_matches(guid: string): Promise<Result<User[], string>> {
		const user = await this.user_repository.findOne({ relations: { likes: true, passes: true }, where: { guid } });

		if (!user) {
			return Err("User not found!");
		}

		let want_genders = [Gender.kMale, Gender.kFemale, Gender.kNonBinary, Gender.kOther];
		if (user.gender == Gender.kMale) {
			switch (user.sexual_orientation) {
				case SexualOrientation.kStraight: { want_genders = [Gender.kFemale];               break; }
				case SexualOrientation.kGay:      { want_genders = [Gender.kMale];                 break; }
				case SexualOrientation.kBisexual: { want_genders = [Gender.kMale, Gender.kFemale]; break; }
				default:               { break; }
			}
		} else if (user.gender == Gender.kFemale) {
			switch (user.sexual_orientation) {
				case SexualOrientation.kStraight: { want_genders = [Gender.kMale];                 break; }
				case SexualOrientation.kGay:      { want_genders = [Gender.kFemale];               break; }
				case SexualOrientation.kLesbian:  { want_genders = [Gender.kFemale];               break; }
				case SexualOrientation.kBisexual: { want_genders = [Gender.kMale, Gender.kFemale]; break; }
				default:               { break; }
			}
		}

		let matches = await this.user_repository.find({ relations: { passes: true }, where: { gender: want_genders[0], guid: Not(user.guid) } });

		for (let i = 1; i < want_genders.length; i++) {
			matches.concat(await this.user_repository.find({ relations: { passes: true }, where: { gender: want_genders[i] } }));
		}
		
		matches = matches.filter(i => !i.passes.find(j => j.guid == guid));
		matches = matches.filter(i => !user.passes.find(j => i.guid == j.guid) && !user.likes.find(j => i.guid == j.guid));

		return Ok(matches);
	}

	async like_user(guid: string, cutie_guid: string): Promise<Result<boolean, string>> {
		if (guid == cutie_guid) {
			return Err("You cannot like yourself!");
		}
		return await this.data_source.transaction(async manager => {
			const user = await manager.findOne(User, { relations: { likes: true, passes: true }, where: { guid } });

			if (!user) {
				return Err("User does not exist!");
			}

			const cutie = await manager.findOne(User, { relations: { likes: true, passes: true }, where: { guid: cutie_guid } })

			if (!cutie) {
				return Err("Cutie does not exist!");
			}

			user.passes = user.passes.filter(p => p.guid != cutie_guid);
			user.likes.push(cutie);

			await manager.save(User, user);

			const matched = !!cutie.likes.find(l => l.guid == guid);
			return Ok(matched);
		});
	}

	async pass_user(guid: string, cutie_guid: string): Promise<Result<null, string>> {
		if (guid == cutie_guid) {
			return Err("You cannot pass yourself!");
		}

		return await this.data_source.transaction(async manager => {
			const user = await manager.findOne(User, { relations: { likes: true, passes: true }, where: { guid } });

			if (!user) {
				return Err("User does not exist!");
			}

			const cutie = await manager.findOne(User, { relations: { likes: true }, where: { guid: cutie_guid } })

			if (!cutie) {
				return Err("Cutie does not exist!");
			}

			user.likes = user.likes.filter(l => l.guid != cutie_guid);
			user.passes.push(cutie);

			await manager.save(User, user);

			return Ok(null);
		});
	}

	async find_likes(guid: string): Promise<Result<User[], string>> {
		const user = await this.user_repository.findOne({ where: { guid } });

		if (!user) {
			return Err("User does not exist!");
		}

		const likes = await this.user_repository.find({ relations: { likes: true }, where: { likes: [user] } })
		return Ok(likes);
	}

	async find_mutual_likes(guid: string): Promise<Result<User[], string>> {
		const user = await this.user_repository.findOne({ relations: { likes: true }, where: { guid } });

		if (!user) {
			return Err("User does not exist!");
		}

		let likes = await this.user_repository.find({ relations: { likes: true }, where: { likes: [user], guid: Not(guid) } })
		likes = likes.filter(l => !!user.likes.find(u => u.guid == l.guid));

		return Ok(likes);
	}

	async send_referral(guid: string, email: string, message: string): Promise<Result<null, string>> {
		return await this.data_source.transaction(async manager => {
			const user = await manager.findOne(User, { relations: { referrals: true }, where: { guid } });

			if (!user) {
				return Err("User does not exist!");
			}

			if (user.gender == Gender.kMale) {
				return Err("Men are not allowed to send referrals.");
			}

			const existing_referral = await manager.findOne(Referral, { relations: { user: true }, where: { email, user } })
			if (existing_referral) {
				return Err("You already referred this email!");
			}

			const referral = new Referral();
			referral.email = email.toLowerCase();
			referral.message = message;
			referral.user = user;

			await manager.save(Referral, referral);

			return Ok(null);
		});

	}
}
