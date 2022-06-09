import { Request } from "express";
import { AppDataSource } from "../../data-source";
import { Company } from "../../entities/companies.entity";
import { serializedCreateUserSchema } from "../../schemas/company/renameCompany.schema";

const companyRegisterService = async ({ validated }: Request) => {
  const companyRepository = AppDataSource.getRepository(Company);

  const company = new Company();
  company.username = validated.username;
  company.email = validated.email;
  company.passwordHash = validated.passwordHash;
  company.razaoSocial = validated.razaoSocial;
  company.cnpj = validated.cnpj;
  company.phone = validated.phone;
  company.logoImage = validated.logoImage;

  await companyRepository.save(company);

  return await serializedCreateUserSchema.validate(company, {
    stripUnknown: true,
  });
};

export default companyRegisterService;
