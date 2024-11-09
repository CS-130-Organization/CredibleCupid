import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Generated, Tree, TreeChildren, TreeParent, ManyToMany, JoinColumn, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm"

export enum Gender {
	kMale      = "Male",
	kFemale    = "Female",
	kNonBinary = "Non-Binary",
	kOther     = "Other",
}

export enum SexualOrientation {
	kStraight  = "Straight",
	kGay       = "Gay",
	kLesbian   = "Lesbian",
	kBisexual  = "Bisexual",
	kAsexual   = "Asexual",
	kOther     = "Other",
}

@Entity("user")
export class User {
	@PrimaryGeneratedColumn({ name: "ROWID" })
	readonly ROWID: number;

	@Column({ type: "text" })
	@Generated("uuid")
	readonly guid: string;

	@Column({ type: "longtext" })
	readonly email: string;

	@Column({ type: "text" })
	readonly password: string;

	@Column({ type: "text", nullable: true })
	first_name: string | undefined;

	@Column({ type: "text", nullable: true })
	last_name: string | undefined;

	@Column({ type: "longtext", nullable: true })
	bio: string | undefined;

	@Column({ type: "enum", enum: Gender, default: Gender.kOther })
	gender: Gender;

	@Column({ type: "text", nullable: true })
	pronouns: string | undefined;

	@Column({ type: "enum", enum: SexualOrientation, default: SexualOrientation.kOther })
	sexual_orientation: SexualOrientation;

	@Column({ type: 'timestamp', nullable: true })
	birthday: Date | undefined;

	@Column({ type: "int", default: 0 })
	height_mm: number;

	@Column({ type: "text", nullable: true })
	occupation: string | undefined;

	@ManyToMany(() => User)
	@JoinTable()
	likes: User[]

	@ManyToMany(() => User)
	@JoinTable()
	passes: User[]

	@Column({ type: "text", nullable: true })
	profile_pic: string | undefined;

	@OneToMany(() => Referral, (referral) => referral.user)
	@JoinTable()
	referrals: Referral[];
}

@Entity("referral")
export class Referral {
	@PrimaryGeneratedColumn({ name: "ROWID" })
	readonly ROWID: number;

	@Column({ type: "text" })
	@Generated("uuid")
	readonly guid: string;

	@Column({ type: "longtext" })
	email: string;

	@Column({ type: "longtext" })
	message: string;

	@ManyToOne(() => User, (user) => user.referrals)
	@JoinTable()
	user: User;
}
