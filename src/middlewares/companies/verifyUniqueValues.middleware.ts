import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../data-source";

import { Company } from "../../entities/companies.entity";

const verifyUniqueValuesMW = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const companyRepository = AppDataSource.getRepository(Company);

  const usernameExists = await companyRepository.findOne({
    where: { username: req.validated.username },
  });

  if (usernameExists) {
    return res.status(409).json({
      error: "Key cnpj or email or username already exists",
    });
  }

  // prettier-ignore
  const emailExists = await companyRepository.findOne({
    where: { email: req.validated.email },
  });

  if (emailExists) {
    return res.status(409).json({
      error: "Key cnpj or email or username already exists",
    });
  }

  // prettier-ignore
  const cnpjExists = await companyRepository.findOne({
    where: { cnpj: req.validated.cnpj },
  });

  if (cnpjExists) {
    return res.status(409).json({
      error: "Key cnpj or email or username already exists",
    });
  }

  return next();
};

export default verifyUniqueValuesMW;
