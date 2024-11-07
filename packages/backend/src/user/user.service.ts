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
		bio: string,
		gender: Gender,
		pronouns: string,
		sexual_orientation: SexualOrientation,
		birthday_ms_since_epoch: number,
		height_mm: number,
		occupation: string
	): Promise<Result<User, string>> {
		return await this.data_source.transaction(async manager => {
			const user = await manager.findOne(User, { where: { guid } })

			if (!user) {
				return Err("User does not exist!");
			}

			user.bio = bio;
			user.gender = gender;
			user.pronouns = pronouns;
			user.sexual_orientation = sexual_orientation;
			user.birthday_ms_since_epoch = birthday_ms_since_epoch;
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
		return await this.user_repository.find({ where: { gender } })
	}
}
