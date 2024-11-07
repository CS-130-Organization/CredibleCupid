import { Body, Controller, UseGuards, Get, Post, Param, ForbiddenException, Query } from '@nestjs/common';
import { JwtAuthGuard, AuthUser } from "../auth/jwt.guard";
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { User, Gender } from "../database/entities";
import { FindMatchingUsersResponse, FindMatchingUsersRequest } from "../dtos/dtos.entity";
import { UserService } from "./user.service";


@ApiTags('matchmaker')
@Controller('matchmaker')
export class MatchMakerController {
	constructor(private user_service: UserService) { }

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@Post("find_matches")
	async find_matches(@AuthUser() user: User, @Body() req: FindMatchingUsersRequest
	): Promise<FindMatchingUsersResponse> {
		const users = await this.user_service.find_matching_users(req.gender);

		return { user_guids: users.map(user => user.guid) };
	}
}
