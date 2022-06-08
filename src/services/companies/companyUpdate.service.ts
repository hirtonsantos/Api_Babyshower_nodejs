import { AppDataSource } from "../../data-source";
import bcrypt from "bcrypt";

import { Company } from "../../entities/companies.entity";
import { ICompanieRegister } from "../../interfaces/companies";

const companyUpdateService = async ({
  username,
  email,
  password,
  razaoSocial,
  cnpj,
  phone,
  imageLogo,
}: ICompanieRegister) => {
  const companyRepository = AppDataSource.getRepository(Company);

  const hashedPassword = await bcrypt.hash(password, 10);

  const company = new Company();
  company.username = username;
  company.email = email;
  company.passwordHash = hashedPassword;
  company.razaoSocial = razaoSocial;
  company.cnpj = cnpj;
  company.phone = phone;
};

export default companyUpdateService;
