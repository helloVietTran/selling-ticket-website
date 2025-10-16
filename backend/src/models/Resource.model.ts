import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

<<<<<<<< HEAD:backend/src/models/Image.model.ts
@Entity('image')
export class Image {
========
@Entity('resource')
export class Resource {
>>>>>>>> 6b5b0843ffa130e4859a68b266c668617c1e70c9:backend/src/models/Resource.model.ts
  @PrimaryColumn()
  id!: String;

  @Column()
  url!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
