import { IsOptional, IsEmail, IsNotEmpty, IsInt, ValidateIf, IsEnum } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express'
import { Gender, SexualOrientation } from "../database/entities"

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

	/*
	 * The first name of the user.
	 */
	first_name: string | undefined;

	/*
	 * The last name of the user.
	 */
	last_name: string | undefined;

	/*
	 * The biography of the user.
	 */
	bio: string | undefined;

	/*
	 * The gender of the user.
	 */
	@IsEnum(Gender)
	gender: Gender;

	/*
	 * The pronouns of the user.
	 */
	pronouns: string | undefined;

	/*
	 * The sexual orientation of the user.
	 */
	@IsEnum(SexualOrientation)
	sexual_orientation: SexualOrientation;

	/*
	 * Birthdate of the user in ms since epoch
	 */
	birthday_ms_since_epoch: number | undefined;

	/*
	 * The height of the user in millimeters
	 */
	height_mm: number | undefined;

	/*
	 * The occupation of the user
	 */
	occupation: string | undefined;

	/*
	 * The GUIDs of the referrals for this user.
	 */
	referrals: string[];
}


export class FindMatchingUsersResponse {
	/*
	 * The list of matching user GUIDs 
	 */
	user_guids: string[];
}

export class UserUpdateBioRequest {
	/*
	 * The first name of the user.
	 */
	first_name: string;

	/*
	 * The last name of the user.
	 */
	last_name: string;

	/*
	 * The biography of the user.
	 */
	bio: string;

	/*
	 * The gender of the user.
	 */
	@IsEnum(Gender)
	gender: Gender;

	/*
	 * The pronouns of the user.
	 */
	pronouns: string;

	/*
	 * The sexual orientation of the user.
	 */
	@IsEnum(SexualOrientation)
	sexual_orientation: SexualOrientation;

	/*
	 * Birthdate of the user in ms since epoch
	 */
	birthday_ms_since_epoch: number;

	/*
	 * The height of the user in millimeters
	 */
	height_mm: number;

	/*
	 * The occupation of the user
	 */
	occupation: string;

	/*
	 * The credibility score of the user
	 */
	credibility_score: number;
}

export class LikeUserResponse {
	/*
	 * The GUID of the user you liked
	 */
	guid: string;
	
	/*
	 * True if there is a match
	 */
	matched: boolean;
}

export class GetLikesResponse {
	/*
	 * The GUIDs of all the users who have liked your profile
	 */
	guids: string[];
}

export class SendReferralRequest {
	/*
	 * The email of the user you wish to refer.
	 */
	email: string;

	/*
	 * The message of the referral to give readers more information.
	 */
	message: string;
}

export class GetReferralResponse {
	/*
	 * The GUID of the referral.
	 */
	guid: string;

	/*
	 * The message in the referral.
	 */
	message: string;

	/*
	 * The email of the user who was referred.
	 */
	referee_email: string;

	/*
	 * The GUID of the user who sent the referral.
	 */
	referrer_guid: string;
}
