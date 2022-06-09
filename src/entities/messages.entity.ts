import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { v4 as uuid } from "uuid"
import { Chat } from "./chat.entity";

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

    @ManyToOne(() => Chat, (chat) => chat)
    chat: Chat

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }

}