import { compare } from "bcrypt";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid";
import { Advert } from "./adverts.entity";

@Entity("companies")
export class Company {
  @PrimaryColumn("uuid")
  readonly id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  razaoSocial: string;

  @Column({ unique: true, length: 14 })
  cnpj: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  logoImage?: string;

  @OneToMany((type) => Advert, (advert) => advert.company, {
    eager: true,
  })
  adverts: Advert[];

  comparePwd = async (passwordString: string): Promise<boolean> => {
    return await compare(passwordString, this.passwordHash);
  };

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
