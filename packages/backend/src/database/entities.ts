import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Generated, Tree, TreeChildren, TreeParent, ManyToMany, JoinColumn, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm"

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
}
