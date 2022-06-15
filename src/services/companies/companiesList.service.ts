import { AppDataSource } from "../../data-source"
import { Company } from "../../entities/companies.entity"

const companiesListService = async () => {    
    
    const companiesRepository = AppDataSource.getRepository(Company)

    const companies = companiesRepository.find()

    return companies

}

export default companiesListService