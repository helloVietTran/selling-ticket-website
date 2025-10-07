import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('resource')
export class Resource {
  @PrimaryColumn()
  id!: String;

  @Column()
  url!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
