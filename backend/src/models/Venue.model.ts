import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Event } from "./Event.model";

@Entity("venue")
export class Venue {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  province!: string;

  @Column()
  city!: string;

  @Column()
  street!: string;

  @OneToMany(() => Event, (event) => event.venue)
  events!: Event[];
}