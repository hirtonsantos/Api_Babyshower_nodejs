import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { v4 as uuid } from "uuid";
import { CategoryAdvert } from "./categoryAdverts.entity";
import { Company } from "./companies.entity";

@Entity("adverts")
export class Advert {
  @PrimaryColumn("uuid")
  readonly id: string;

  @Column()
  title: string;

  @Column("float")
  apliedPrice: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  linkAdverts: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne((type) => Company, (company) => company.adverts)
  company: Company;

  @ManyToOne((type) => CategoryAdvert, (category) => category.adverts, {
    eager: true,
  })
  category: CategoryAdvert;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
