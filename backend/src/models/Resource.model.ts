import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('image')
export class Image {
  @PrimaryColumn()
  id!: String;

  @Column()
  url!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
