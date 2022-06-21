import { CategoryAdvert } from "../../entities/categoryAdverts.entity";

export interface IAdvert {
    title?: string;
    apliedPrice?: number;
    description?: string;
    linkAdverts?: string;
    image?: string;
    category?: any;
  }