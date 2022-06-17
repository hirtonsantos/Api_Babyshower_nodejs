import { AlreadyHasActiveConnectionError } from "typeorm"
import { AppDataSource } from "../../data-source"
import { Advert } from "../../entities/adverts.entity"
import { Company } from "../../entities/companies.entity"

const advertsListByCompanyService = async (companyId: string) => {

    const companyRepository = AppDataSource.getRepository(Company) 

    //find company
    const company = await companyRepository.findOneBy({id: companyId})


    return company?.adverts as Advert[]
}

export default advertsListByCompanyService