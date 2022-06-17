import { Request } from "express";
import { AppDataSource } from "../../data-source";
import { Company } from "../../entities/companies.entity";
import verifyIfAdmOrCompany from "../../test/utils/company/verifyIfAdmOrCompany";

const companyUpdateService = async (id: string, idToken: string, { validated }: Request) => {
    
    await verifyIfAdmOrCompany(idToken);

    const companyRepository = AppDataSource.getRepository(Company);

    await companyRepository.update(id, { ...validated })

    return true;
};

export default companyUpdateService;
