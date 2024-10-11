import { Controller, Post, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { LoginRequest, LoginResponse } from "../dtos/dtos.entity";
import { } from '@nestjs/swagger';
import { AuthService } from "./auth.service";
import { JwtAuthGuard, AuthUser } from "./jwt.guard";
import { User } from "../database/entities";
import { JWT_EXPIRE_SEC } from "../env";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private auth_service: AuthService) {

	}

	@Post("login")
	async auth_login(@Body() req: LoginRequest): Promise<LoginResponse> {
		const user = await this.auth_service.validate(req.email, req.password);
		if (!user) {
			throw new UnauthorizedException("Invalid credentials!");
		}

		const jwt = this.auth_service.login(user);

		return { jwt, user_guid: user.guid, expire_sec: JWT_EXPIRE_SEC };
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@Post("refresh")
	async auth_refresh(@AuthUser() user: User): Promise<LoginResponse> {
		const jwt = this.auth_service.login(user);

		return { jwt, user_guid: user.guid, expire_sec: JWT_EXPIRE_SEC };
	}

	@Post("signup")
	async auth_signup(@Body() req: LoginRequest) {
		const res = await this.auth_service.signup(req.email, req.password);

		if (!res) {
			throw new UnauthorizedException("User with email already exists!");
		}

		return await this.auth_login(req);
	}
}
