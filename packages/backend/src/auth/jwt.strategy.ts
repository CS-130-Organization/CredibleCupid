import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { User } from "../database/entities";
import { UserService } from "../user/user.service";
import { JWT_SECRET } from "../env";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private user_service: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: JWT_SECRET,
		});
	}

	// Called by PassportStrategy guard.
	async validate(payload: any): Promise<User> {
		const guid = payload.sub;
		const user = await this.user_service.find_user_with_guid(guid);
		return user!;
	}
}

