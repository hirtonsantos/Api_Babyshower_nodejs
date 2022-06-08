import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne } from "typeorm";
import { v4 as uuid } from "uuid"
import { Message } from "./messages.entity";

@Entity("chat")
export class Chat {

    @PrimaryColumn("uuid")
    readonly id: string

    @Column()
    created_at: string

    @Column()
    updated_at: string

    @Column("boolean", {default:false})
    archived: boolean

    @Column()
    parent_id_main: string

    @Column()
    parent_id_retrieve: string

    @ManyToOne(type => Message, message => message.chat_id)
    messages: Message[]

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }

}