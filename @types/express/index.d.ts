import { Company } from "../../src/entities/companies.entity";

declare global {
  namespace Express {
    interface Request {
      validated: Company;
      AdminId: string
    }
  }
}
