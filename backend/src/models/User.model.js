import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, TableInheritance } from "typeorm";

@Entity("user")
@TableInheritance({pattern: "class-table"})
export class User {
    @PrimaryGeneratedColumn()
    userId;

    @Column({ type: "varchar" })
    userName;

    @Column({ type: "varchar", unique: true, nullable: false })
    email;

    @Column({ type: "varchar", nullable: false })
    passwordHash;

    @ManyToMany(() => Role, role => role.users)
    @JoinTable({ name: "user_role" })
    roles;
}
