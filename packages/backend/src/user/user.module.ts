import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ReferralService } from './referral.service';
import { User, Referral } from "../database/entities";
import { UserController } from "./user.controller";
import { MatchMakerController } from "./matchmaker.controller";
import { ReferralController } from "./referral.controller";

@Module({
	imports: [TypeOrmModule.forFeature([User, Referral])],
	providers: [UserService, ReferralService],
	exports: [UserService, ReferralService],
	controllers: [UserController, MatchMakerController, ReferralController]
})
export class UserModule { }
