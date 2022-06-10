import { Company } from "../../src/entities/companies.entity";
import { Administrator } from "../../src/entities/administrators.entity";

declare global {
  namespace Express {
    interface Request {
      validated: Company & Administrator;
    }
  }
}
