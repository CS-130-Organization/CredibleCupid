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
	bio: string;

	@Column({ type: "enum", enum: Gender, default: Gender.kOther })
	gender: Gender;

	@Column({ type: "text", nullable: true })
	pronouns: string;

	@Column({ type: "enum", enum: SexualOrientation, default: SexualOrientation.kOther })
	sexual_orientation: SexualOrientation;

	@Column({ type: "int", default: 0 })
	birthday_ms_since_epoch: number;

	@Column({ type: "int", default: 0 })
	height_mm: number;

	@Column({ type: "text", nullable: true })
	occupation: string;
}
