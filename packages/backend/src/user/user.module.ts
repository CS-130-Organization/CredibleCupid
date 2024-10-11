import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from "../database/entities";
import { UserController } from "./user.controller";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserService],
	exports: [UserService],
	controllers: [UserController]
})
export class UserModule { }
