import { compare } from "bcrypt";
import { Entity, Column, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("administrators")
export class Administrator {
  @PrimaryColumn("uuid")
  readonly id?: string;

  @Column("varchar", { unique: true })
  username: string;

  @Column("varchar", { unique: true })
  email: string;

  @Column("varchar")
  passwordHash: string;

  comparePwd = async (pwdString: string): Promise<boolean> => {
    return await compare(pwdString, this.passwordHash);
  };

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
