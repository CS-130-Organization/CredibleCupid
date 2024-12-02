import { Module } from '@nestjs/common';

import { TypeOrmModule } from "@nestjs/typeorm"

import { User, Referral } from "./database/entities"
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DATABASE_PASSWORD, DATABASE_NAME } from "./env"


@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: 'db',
			port: 3306,
			username: 'root',
			password: DATABASE_PASSWORD,
			database: DATABASE_NAME,
			entities: [User, Referral],
			synchronize: true,
		}),
		AuthModule,
		UserModule
	],
})
export class AppModule { }
