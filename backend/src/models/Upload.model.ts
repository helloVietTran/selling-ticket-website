import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('upload')
export class Upload {
  @PrimaryColumn()
  id!: String;

  @Column()
  url!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
