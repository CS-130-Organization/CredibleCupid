import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from "../database/entities";
import { UserController } from "./user.controller";
import { MatchMakerController } from "./matchmaker.controller";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserService],
	exports: [UserService],
	controllers: [UserController, MatchMakerController]
})
export class UserModule { }
