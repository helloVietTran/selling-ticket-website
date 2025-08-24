import { ChildEntity } from "typeorm";
import { User } from "./User.model";

@ChildEntity()
export class Organizer extends User {
    @Column({ type: "varchar" })
    organizationName;

    // one to many event
}