import { IsEmail, IsNotEmpty, IsInt, ValidateIf } from "class-validator";

export class LoginRequest {
	/*
	 * The email of the user. Needs to be a valid email otherwise 400 will be returned.
	 */
	@IsNotEmpty()
	@IsEmail()
	email: string;

	/*
	 * The plain-text password of the user. This does not need to be hashed client side.
	 */
	@IsNotEmpty()
	password: string;
}

export class LoginResponse {
	/*
	 * The user's GUID.
	 */
	user_guid: string;

	/*
	 * The JSON Web Token (jwt) that is required to perform any authorized actions.
	 */
	jwt: string;

	/*
	 * The expire time of the jwt in seconds.
	 */
	expire_sec: number;
}

export class GetUserResponse {
	/*
	 * The name of the user.
	 */
	email: string;

	/*
	 * The GUID of the user.
	 */
	guid: string;
}
