import { AppDataSource } from "../../data-source"
import { Advert } from "../../entities/adverts.entity"
import { Company } from "../../entities/companies.entity"

const advertsListByCompanyService = async (companyId: string) => {

    const adsRepository = AppDataSource.getRepository(Advert) 
    const companyRepository = AppDataSource.getRepository(Company) 

    //find company
    const companies = await companyRepository.find()
    const company = companies.find(company => company.id === companyId) 

    //find ads by company
    const adverts = await adsRepository.find()
    const advertsByCompany = adverts.find(ad => ad.company === company)

    return advertsByCompany
}

export default advertsListByCompanyService