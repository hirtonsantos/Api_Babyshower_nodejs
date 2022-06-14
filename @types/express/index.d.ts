import { Company } from "../../src/entities/companies.entity";
import { Administrator } from "../../src/entities/administrators.entity";
import { ICompanyLogin } from "../../src/interfaces/companies/index";
import { IAdministratorLogin } from "../../src/interfaces/administrators";

declare global {
  namespace Express {
    interface Request {
      validated: Company | ICompanyLogin;
      validatedAdmin: IAdministratorLogin;
      decoded: Administrator;
      userId: string;
    }
  }
}
