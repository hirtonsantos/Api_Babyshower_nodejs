import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid"
import { Message } from "./messages.entity";

@Entity("chat")
export class Chat {

    @PrimaryColumn("uuid")
    readonly id: string

    @Column("boolean", {default:false})
    archived: boolean

    @Column()
    parent_user: number

    @Column()
    other_parent_user: number

    @OneToMany(() => Message, (message) => message.chat, {
        eager: true
    })
    messages: Message[]


    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }

}