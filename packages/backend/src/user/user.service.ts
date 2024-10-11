import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";;

import { User } from "../database/entities";



@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private user_repository: Repository<User>,) { }

	async find_user_with_email(email: string): Promise<User | null> {
		return await this.user_repository.findOne({ where: { email } });
	}

	async create_user(email: string, password: string): Promise<User | null> {
		if (await this.find_user_with_email(email)) {
			return null;
		}

		return await this.user_repository.save({ email, password });
	}

	async find_user_with_guid(guid: string): Promise<User | null> {
		return await this.user_repository.findOne({ where: { guid } });
	}
}
