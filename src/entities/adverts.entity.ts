import { Entity, Column, PrimaryColumn, ManyToOne} from "typeorm";
import { v4 as uuid } from "uuid"
import { CategoryAdvert } from "./categoryAdverts.entity";
import { Companie } from "./companies.entity";

@Entity("adverts")
export class Advert {

    @PrimaryColumn("uuid")
    readonly id: string

    @Column()
    title: string

    @Column('float', {unique: true})
    apliedPrice: number

    @Column()
    description: string

    @Column({unique: true})
    linkAdverts: string
    
    @ManyToOne(type => Companie, companie => companie.adverts)
    companie: Companie

    @ManyToOne(type => CategoryAdvert, category => category.adverts, {
        eager: true
    })
    category: CategoryAdvert

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }

}