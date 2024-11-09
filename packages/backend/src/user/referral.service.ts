import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, Not } from "typeorm";;

import { User, Referral, Gender, SexualOrientation } from "../database/entities";
import { Ok, Err, Result } from "ts-results";

import * as fs from "fs";



@Injectable()
export class ReferralService {
	constructor(private data_source: DataSource,
		@InjectRepository(Referral) private referral_repository: Repository<Referral>,
		@InjectRepository(User) private user_repository: Repository<User>,
	) { }

	async find_referrals_for_email(email: string): Promise<Referral[]> {
		email = email.toLowerCase();
		const referrals = await this.referral_repository.find({ relations: { user: true }, where: { email, user: { gender: Not(Gender.kMale) } } });
		if (!referrals) {
			return [];
		}

		return referrals;
	}

	async get_referral(guid: string): Promise<Result<Referral, string>> {
		const referral = await this.referral_repository.findOne({ relations: { user: true }, where: { guid } });
		if (!referral) {
			return Err("Referral does not exist!");
		}

		return Ok(referral);
	}
}
