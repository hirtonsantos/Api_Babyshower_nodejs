import { AppDataSource } from "../../data-source";
import { Company } from "../../entities/companies.entity";

const companyDeleteService = async (id: string /* , idToken: string */) => {
  const companyRepository = AppDataSource.getRepository(Company);

  await companyRepository.delete(id);
};

export default companyDeleteService;
