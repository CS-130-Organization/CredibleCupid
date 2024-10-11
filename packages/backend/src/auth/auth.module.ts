import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { AuthController } from './auth.controller';

import { JwtModule } from "@nestjs/jwt";

import { JwtStrategy } from "./jwt.strategy";
import { JWT_SECRET, JWT_EXPIRE_SEC } from "../env";


@Module({
	imports: [UserModule,
		PassportModule,
		JwtModule.register({
			secret: JWT_SECRET,
			signOptions: { expiresIn: JWT_EXPIRE_SEC }
		}),
	],
	providers: [AuthService, JwtStrategy],
	controllers: [AuthController],
})
export class AuthModule {
}
