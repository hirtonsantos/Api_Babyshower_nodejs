import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../data-source";

import { Company } from "../../entities/companies.entity";

const verifyUniqueValuesMW = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, cnpj } = req.body;

  const companyRepository = AppDataSource.getRepository(Company);
  const companies = await companyRepository.find();

  const usernameExists = companies.find(
    (company) => company.username === username
  );

  // prettier-ignore
  const emailExists = companies.find(
        (company) => company.email === email
    );

  // prettier-ignore
  const cnpjExists = companies.find(
        (company) => company.cnpj === cnpj
    );

  if (usernameExists) {
    return res.status(409).json({
      message: "Username already exists",
    });
  }

  if (emailExists) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }

  if (cnpjExists) {
    return res.status(409).json({
      message: "CNPJ already exists",
    });
  }

  next();
};

export default verifyUniqueValuesMW;
