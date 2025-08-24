import { Entity, Column, ManyToMany, PrimaryColumn } from "typeorm";

@Entity("role")
export class Role {
    @PrimaryColumn()
    roleName;

    @Column({ type: "varchar" })
    description;

    @ManyToMany(() => User, user => user.roles)
    users;
}
