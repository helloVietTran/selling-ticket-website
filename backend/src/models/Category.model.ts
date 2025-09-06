// src/models/Category.model.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from './Event.model';

@Entity('categorys')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId!: number; // ID duy nhất của category

  @Column({ name: 'category_name' })
  name!: string; // Tên category, ví dụ: "Ca nhạc"

  @Column({ name: 'category_description', type: 'text', nullable: true })
  description?: string; // Mô tả thêm nếu cần

  // Liên kết với Event: 1 Category có nhiều Event
  @OneToMany(() => Event, (event) => event.category)
  events!: Event[];
}
