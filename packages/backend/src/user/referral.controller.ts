import { Body, Controller, UseGuards, Get, Post, Param, ForbiddenException, Query } from '@nestjs/common';
import { JwtAuthGuard, AuthUser } from "../auth/jwt.guard";
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { User, Gender } from "../database/entities";
import { SendReferralRequest, GetReferralResponse } from "../dtos/dtos.entity";
import { UserService } from "./user.service";
import { ReferralService } from "./referral.service";


@ApiTags('referral')
@Controller('referral')
export class ReferralController {
	constructor(private user_service: UserService, private referral_service: ReferralService) { }

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@Post("send_referral")
	async send_referral(@AuthUser() user: User, @Body() req: SendReferralRequest) {
		const res = await this.user_service.send_referral(user.guid, req.email, req.message);

		if (res.err) {
			throw new ForbiddenException(res.val);
		}
	}

	@ApiParam({ name: "guid", required: true, description: "Referral GUID" })
	@Get(":guid/query")
	async get_referral(@Param() param: { guid: string }): Promise<GetReferralResponse> {
		const res = await this.referral_service.get_referral(param.guid);

		if (res.err) {
			throw new ForbiddenException(res.val);
		}

		return {
			guid: res.val.guid,
			message: res.val.message,
			referee_email: res.val.email,
			referrer_guid: res.val.user.guid,
		}
	}
}
