import { Company } from "../../src/entities/companies.entity";
import { ICompanyLogin } from "../../src/interfaces/companies/index";

declare global {
  namespace Express {
    interface Request {
      validated: Company | ICompanyLogin;
    }
  }
}
