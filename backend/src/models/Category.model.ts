import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToOne } from 'typeorm';
import { Event } from './Event.model';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId!: number;

  @Column({ name: 'category_name' })
  categoryName!: string;

  @OneToMany(() => Event, (event) => event.category)
  events!: Event[];
}
