import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { v4 as uuid } from "uuid";
import { Chat } from "./chat.entity";

@Entity("message", {
  orderBy: {
    createdAt: "DESC",
  },
})
export class Message {
  @PrimaryColumn("uuid")
  readonly id: string;

  @Column()
  message: string;

  @Column("boolean", { default: false })
  read_message: boolean;

  @Column({ type: "timestamptz", default: () => "NOW()" })
  createdAt: Date;

  @Column()
  parent_id: number;

  @ManyToOne(() => Chat, (chat) => chat.id)
  chat: Chat;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
