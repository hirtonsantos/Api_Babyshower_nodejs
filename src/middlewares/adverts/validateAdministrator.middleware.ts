import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../data-source";
import { Administrator } from "../../entities/administrators.entity";
import { Company } from "../../entities/companies.entity";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

/*
  This middleware checks:
  - If user is logged
  - If token is valid
  - If user is adm
  - If company is accessing another company info
*/

const validateAdministratorMW = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { id } = req.params;

  if (!token) {
    return res.status(400).json({ Error: "Missing authorization token" });
  }

  jwt.verify(token, process.env.SECRET_KEY as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ Error: "Invalid Token" });
    }
  });

  const decoded: any = jwt.decode(token);

  const companyRepository = AppDataSource.getRepository(Company);
  const companies = await companyRepository.find();

  const company = companies.find((company) => company.id === id);

  if (!company) {
    return res.status(404).json({ Error: "Company not found" });
  }

  const administratorRepository = AppDataSource.getRepository(Administrator);
  const administrators = await administratorRepository.find();

  const administrator = administrators.find(
    (administrator) => administrator.id === decoded.id
  );

  if (!administrator) {
    if (decoded.id === id) {
      return next();
    }

    if (decoded.id !== id) {
      return res.status(403).json({
        Error: "You are not allowed to access this information",
      });
    }
  }

  if (administrator) {
    return next();
  }
};

export default validateAdministratorMW;
