import { Entity, PrimaryGeneratedColumn, Column, TableInheritance } from 'typeorm';
import { Role } from '../types/enum';
@Entity('user')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 50 })
  userName!: string;

  @Column({ type: 'varchar' })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: Role
  })
  roles!: Role;
}
