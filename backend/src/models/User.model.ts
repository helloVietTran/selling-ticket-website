import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
} from "typeorm";
import { Role } from "../types/enum"
@Entity("user")
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  userName!: string;

  @Column()
  passwordHash!: string;

  @Column({ 
    type:"enum",
    enum: Role
   })
  roles!: Role;
}

