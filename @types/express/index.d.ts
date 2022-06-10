import { Company } from "../../src/entities/companies.entity";
import { ICompanyLogin } from "../../src/interfaces/companies/index";

declare global {
  namespace Express {
    interface Request {
<<<<<<< HEAD
      validated: Company;
      AdminId: string
=======
      validated: Company | ICompanyLogin;
>>>>>>> development
    }
  }
}
