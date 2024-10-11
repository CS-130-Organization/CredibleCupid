import { createParamDecorator, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


// Important for type definitions of user in the @Req() object.
import * as DBEntities from "../database/entities";

declare global {
	namespace Express {
		interface User extends DBEntities.User {
		}
	}
}

export const AuthUser = createParamDecorator(
	(_: unknown, ctx: ExecutionContext): DBEntities.User => {
		const request = ctx.switchToHttp().getRequest();
		return request.user as DBEntities.User;
	},
);

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") { }

