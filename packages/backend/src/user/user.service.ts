import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";;

import { User, Gender, SexualOrientation } from "../database/entities";
import { Ok, Err, Result } from "ts-results";



@Injectable()
export class UserService {
	constructor(private data_source: DataSource,
		@InjectRepository(User) private user_repository: Repository<User>,
	) { }

	async find_user_with_email(email: string): Promise<User | null> {
		return await this.user_repository.findOne({ where: { email } });
	}

	async create_user(email: string, password: string): Promise<User | null> {
		if (await this.find_user_with_email(email)) {
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
			const user = await manager.findOne(User, { where: { guid } });

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

			await manager.save(User, user);

			return Ok(user);
		});
	}

	async find_user_with_guid(guid: string): Promise<User | null> {
		return await this.user_repository.findOne({ where: { guid } });
	}

	async find_matching_users(gender?: Gender): Promise<User[]> {
		return await this.user_repository.find({ relations: { passes: true }, where: { gender } })
	}

	async like_user(guid: string, cutie_guid: string): Promise<Result<boolean, string>> {
		if (guid == cutie_guid) {
			return Err("You cannot like yourself!");
		}
		return await this.data_source.transaction(async manager => {
			const user = await manager.findOne(User, { relations: { likes: true }, where: { guid } });

			if (!user) {
				return Err("User does not exist!");
			}

			const cutie = await manager.findOne(User, { relations: { likes: true }, where: { guid: cutie_guid } })

			if (!cutie) {
				return Err("Cutie does not exist!");
			}

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
			const user = await manager.findOne(User, { relations: { likes: true }, where: { guid } });

			if (!user) {
				return Err("User does not exist!");
			}

			const cutie = await manager.findOne(User, { relations: { likes: true }, where: { guid: cutie_guid } })

			if (!cutie) {
				return Err("Cutie does not exist!");
			}

			const length_before = user.likes.length;
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
		const user = await this.user_repository.findOne({ where: { guid } });

		if (!user) {
			return Err("User does not exist!");
		}

		let likes = await this.user_repository.find({ relations: { likes: true }, where: { likes: [user] } })

		return Ok(likes);
	}
}
