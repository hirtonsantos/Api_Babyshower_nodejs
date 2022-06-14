import { AppDataSource } from "../../data-source"
import { Company } from "../../entities/companies.entity"
import { ICompany } from "../../test"

const companiesListOneService = async (companyId: string) => {

    const userRepository = AppDataSource.getRepository(Company) 

    const companies = await userRepository.find()

    const account = companies.find(company => company.id === companyId) as ICompany

    let {email, username, id, logoImage, cnpj, phone, razaoSocial} = account

    return {
        id, 
        email, 
        username,
        cnpj, 
        phone, 
        razaoSocial,
        logoImage, 
        adverts: `/adverts/byCompany/${id}`
    }
}

export default companiesListOneService