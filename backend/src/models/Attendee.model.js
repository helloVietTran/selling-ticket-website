
import { ChildEntity, Column } from "typeorm";
import { User } from "./User.model";

@ChildEntity()
export class Attendee extends User {
    @Column({ type: "varchar" })
    phoneNumber;
}