import { Body, Controller, UseGuards, Get, Post, Param, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard, AuthUser } from "../auth/jwt.guard";
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { User } from "../database/entities";
import { GetUserResponse, UpdateUserBioRequest } from "../dtos/dtos.entity";
import { UserService } from "./user.service";


@ApiTags('user')
@Controller('user')
export class UserController {
	constructor(private user_service: UserService) { }

	@ApiParam({ name: "guid", required: true, description: "User GUID" })
	@Get(":guid/query")
	async query_user(@Param() param: { guid: string }): Promise<GetUserResponse> {
		const user = await this.user_service.find_user_with_guid(param.guid);
		if (!user) {
			throw new ForbiddenException("User does not exist!");
		}

		return { 
			email: user.email,
			guid: user.guid,
			bio: user.bio,
			gender: user.gender,
			pronouns: user.pronouns,
			sexual_orientation: user.sexual_orientation,
			birthday_ms_since_epoch: user.birthday_ms_since_epoch,
			height_mm: user.height_mm,
			occupation: user.occupation,
		};
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@Post("update_user_bio")
	async update_user_bio(@AuthUser() user: User, @Body() req: UpdateUserBioRequest): Promise<GetUserResponse> {
		const res = await this.user_service.update_user_bio(
			user.guid,
			req.bio,
			req.gender,
			req.pronouns,
			req.sexual_orientation,
			req.birthday_ms_since_epoch,
			req.height_mm,
			req.occupation
		);

		if (res.err) {
			throw new ForbiddenException(res.val);
		}

		const updated_user = res.val;

		return { 
			email: updated_user.email,
			guid: updated_user.guid,
			bio: updated_user.bio,
			gender: updated_user.gender,
			pronouns: updated_user.pronouns,
			sexual_orientation: updated_user.sexual_orientation,
			birthday_ms_since_epoch: updated_user.birthday_ms_since_epoch,
			height_mm: updated_user.height_mm,
			occupation: updated_user.occupation,
		};
	}

}
