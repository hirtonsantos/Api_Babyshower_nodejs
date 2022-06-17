import { AppDataSource } from "../../../data-source";
import { Administrator } from "../../../entities/administrators.entity";
import { Company } from "../../../entities/companies.entity";
import { AppError } from "../../../errors/appError";

const verifyIfAdmOrCompany = async (id: string) => {
    const admRepository = AppDataSource.getRepository(Administrator);
    const companyRepository = AppDataSource.getRepository(Company)
  
    const adms = await admRepository.find();
    const companies = await companyRepository.find()
  
    const admAccountLogged = adms.find((adm) => adm.id === id);
    const companyAccountLogged = companies.find((company) => company.id === id)
  
    if (!admAccountLogged && !companyAccountLogged) {
      throw new AppError(403, {
        "Error": "You can't access information of another company",
      });
    }  

    return true
};
  
export default verifyIfAdmOrCompany;