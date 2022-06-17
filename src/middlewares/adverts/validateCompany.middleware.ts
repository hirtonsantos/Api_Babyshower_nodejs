import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../data-source";
import { Company } from "../../entities/companies.entity";
import { AppError } from "../../errors/appError";

const validateAdvertMW = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const companyRepository = AppDataSource.getRepository(Company);
  const companies = await companyRepository.find();

  const company = companies.find((company) => company.id === id);

  if (!company) {
    throw new AppError(404, { Error: "Compan not found" });
  }

  return next();
};

export default validateAdvertMW;
