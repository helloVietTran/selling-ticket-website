import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("disabletoken")
export class DisabledToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  token!: string;

  @Column({ type: "datetime" })
  expiresAt!: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}
