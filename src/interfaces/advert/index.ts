import { CategoryAdvert } from "../../entities/categoryAdverts.entity";

export interface IAdvert {
    title: string;
    apliedPrice: number;
    description: string;
    linkAdvert: string;
    image: string;
    category: CategoryAdvert;
  }