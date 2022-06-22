import { Company } from "../../entities/companies.entity";

export interface IAdvertsReq {
  title: string;
  apliedPrice: number;
  description: string;
  linkAdvert?: string;
  image?: string;
  category: string;
  company: Company;
}
