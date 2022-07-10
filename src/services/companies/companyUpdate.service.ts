import { Request } from "express";
import { AppDataSource } from "../../data-source";
import { Company } from "../../entities/companies.entity";

const companyUpdateService = async (id: string, { validated }: Request) => {
  const companyRepository = AppDataSource.getRepository(Company);

  await companyRepository.update(id, { ...validated });
};

export default companyUpdateService;
