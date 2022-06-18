import { Company } from "../../src/entities/companies.entity";
import { Administrator } from "../../src/entities/administrators.entity";
import { ICompanyLogin } from "../../src/interfaces/companies/index";
import { IAdministratorLogin } from "../../src/interfaces/administrators";
import { IAdvertsReq } from "../../src/interfaces/adverts";
import { Advert } from "../../src/entities/adverts.entity";

declare global {
  namespace Express {
    interface Request {
      validated: Company | ICompanyLogin;
      validatedAdmin: IAdministratorLogin;
      validatedAdvert: Advert | IAdvertsReq;
      decoded: Administrator;
      userId: string;
    }
  }
}
