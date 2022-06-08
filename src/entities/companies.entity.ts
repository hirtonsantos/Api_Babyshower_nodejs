import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid";
import { Advert } from "./adverts.entity";

@Entity("companies")
export class Companie {
  @PrimaryColumn("uuid")
  readonly id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  razaoSocial: string;

  @Column({ unique: true, length: 11 })
  cnpj: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  logoImage: string;

  @OneToMany((type) => Advert, (advert) => advert.companie, {
    eager: true,
  })
  adverts: Advert[];

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
