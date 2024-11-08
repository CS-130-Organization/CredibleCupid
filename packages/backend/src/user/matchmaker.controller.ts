import { Body, Controller, UseGuards, Get, Post, Param, ForbiddenException, Query } from '@nestjs/common';
import { JwtAuthGuard, AuthUser } from "../auth/jwt.guard";
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { User, Gender } from "../database/entities";
import { FindMatchingUsersResponse, LikeUserResponse } from "../dtos/dtos.entity";
import { UserService } from "./user.service";


@ApiTags('matchmaker')
@Controller('matchmaker')
export class MatchMakerController {
	constructor(private user_service: UserService) { }

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@Post("find_matches")
	async find_matches(@AuthUser() user: User): Promise<FindMatchingUsersResponse> {
		const res = await this.user_service.find_matches(user.guid);

		if (res.err) {
			throw new ForbiddenException(res.val);
		}

		return { user_guids: res.val.map(user => user.guid) };
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiParam({ name: "guid", required: true, description: "GUID of user to like" })
	@Post(":guid/like")
	async like_user(@AuthUser() user: User, @Param() param: { guid: string }): Promise<LikeUserResponse> {
		const res = await this.user_service.like_user(user.guid, param.guid);

		if (res.err) {
			throw new ForbiddenException(res.val);
		}

		return { guid: param.guid, matched: res.val };
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiParam({ name: "guid", required: true, description: "GUID of user to pass" })
	@Post(":guid/pass")
	async pass_user(@AuthUser() user: User, @Param() param: { guid: string }) {
		const res = await this.user_service.pass_user(user.guid, param.guid);

		if (res.err) {
			throw new ForbiddenException(res.val);
		}

		return { guid: param.guid, matched: res.val };
	}
}
