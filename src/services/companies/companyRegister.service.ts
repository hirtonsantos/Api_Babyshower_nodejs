import { Request } from "express";
import { AppDataSource } from "../../data-source";
import { Company } from "../../entities/companies.entity";
import { serializedCreateUserSchema } from "../../schemas/company/renameCompany.schema";

const companyRegisterService = async ({ validated }: Request) => {
  const companyRepository = AppDataSource.getRepository(Company);
  console.log(validated)
  const company = Object.assign(new Company(), validated);

  await companyRepository.save(company);

  return await serializedCreateUserSchema.validate(company, {
    stripUnknown: true,
  });
};

export default companyRegisterService;
