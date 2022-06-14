import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid";
import { Advert } from "./adverts.entity";

@Entity("categories_adverts")
export class CategoryAdvert {
  @PrimaryColumn("uuid")
  readonly id: string;

  @Column()
  title: string; //Aqui precisa ser único e padronizado.

  @Column("float")
  price: number;

  @Column()
  description: string;

  @OneToMany((type) => Advert, (advert) => advert.category)
  adverts: Advert[];

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
