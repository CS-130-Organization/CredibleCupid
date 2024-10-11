import { Controller, UseGuards, Get, Param, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard, AuthUser } from "../auth/jwt.guard";
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { User } from "../database/entities";
import { GetUserResponse } from "../dtos/dtos.entity";
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

		return { email: user.email, guid: user.guid };
	}

}
