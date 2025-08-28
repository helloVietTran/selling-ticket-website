import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
} from "typeorm";

@Entity("user")
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({type: "varchar", length: 50})
  userName!: string;

  @Column({type: "varchar"})
  passwordHash!: string;

  @Column({ type: "simple-array", nullable: true })
  roles!: string[];
}

