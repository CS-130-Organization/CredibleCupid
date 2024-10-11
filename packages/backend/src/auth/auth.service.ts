import { Injectable } from '@nestjs/common';

import { UserService } from "../user/user.service";
import { User } from "../database/entities";
import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
	constructor(private user_service: UserService, private jwt_service: JwtService) { }

	async validate(email: string, password: string): Promise<User | null> {
		email = email.toLowerCase();

		const db_user = await this.user_service.find_user_with_email(email);
		if (!db_user) {
			return null;
		}

		if (!await bcrypt.compare(password, db_user.password)) {
			return null;
		}

		return db_user;
	}

	login(user: User): string {
		const payload: any = { sub: user.guid };
		return this.jwt_service.sign(payload);
	}

	async signup(email: string, password: string): Promise<boolean> {
		email = email.toLowerCase();
		if (await this.user_service.find_user_with_email(email)) {
			return false;
		}

		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);

		const db_user = await this.user_service.create_user(email, hash);

		return true;
	}
}
