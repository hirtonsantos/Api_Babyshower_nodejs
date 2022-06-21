import { Company } from "../../src/entities/companies.entity";
import { Administrator } from "../../src/entities/administrators.entity";
import { ICompanyLogin } from "../../src/interfaces/companies/index";
import { IAdministratorLogin } from "../../src/interfaces/administrators";
import { IAdvert } from "../../src/interfaces/advert";

declare global {
  namespace Express {
    interface Request {
      validated: Company | ICompanyLogin;
      validatedAdmin: IAdministratorLogin;
      validatedAd: IAdvert
      decoded: Administrator;
      userId: string;
    }
  }
}
