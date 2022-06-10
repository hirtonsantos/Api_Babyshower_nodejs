import { Company } from "../../src/entities/companies.entity";
import { Administrator } from "../../src/entities/administrators.entity";
import { ICompanyLogin } from "../../src/interfaces/companies/index";

declare global {
  namespace Express {
    interface Request {
      validated: Company & Administrator;
      validated: Company | ICompanyLogin;
    }
  }
}
