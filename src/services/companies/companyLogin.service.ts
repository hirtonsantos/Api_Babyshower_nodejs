import { ICompanyLogin } from "../../interfaces/companies";
import { AppDataSource } from "../../data-source";
import { Company } from "../../entities/companies.entity";
import jwt from "jsonwebtoken";
import { AppError } from "../../errors/appError";

import * as dotenv from "dotenv";

dotenv.config();

const companyLoginService = async ({ email, password }: ICompanyLogin) => {
  const companyRepository = AppDataSource.getRepository(Company);

  const companies = await companyRepository.find();

  const account = companies.find((company) => company.email === email);

  if (!account || !(await account.comparePwd(password))) {
    throw new AppError(401, { Error: "User not authorized" });
  }

  const token: string = jwt.sign(
    { id: account.id },
    String(process.env.SECRET_KEY),
    { expiresIn: process.env.EXPIRES_IN }
  );

  return token;
};

export default companyLoginService;
