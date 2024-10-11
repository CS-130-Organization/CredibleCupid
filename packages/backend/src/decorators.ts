import { createParamDecorator, ExecutionContext, BadRequestException } from "@nestjs/common";

export const RequiredQuery = createParamDecorator(
	(key: string, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()

		const val = request.query[key]

		if (!val) {
			throw new BadRequestException("Query param " + key + " is required!")
		}

		return val
	}
)
