import { Entity, Column, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid"

@Entity("message")
export class Message {

    @PrimaryColumn("uuid")
    readonly id: string

    @Column()
    message: string

    @Column("boolean", {default: false})
    read_message: boolean

    @Column()
    parent_id: string

    @Column()
    chat_id: string

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }

}