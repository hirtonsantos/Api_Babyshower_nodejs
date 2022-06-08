import {ICompanyLogin} from "../../interfaces/companies"
import { AppDataSource } from "../../data-source"
import { Company } from "../../entities/companies.entity"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const companyLoginService = async ({email, password}: ICompanyLogin) => {
    try {
        const companyRepository = AppDataSource.getRepository(Company)

        const account = await companyRepository.find()
        
    } catch (error) {
        
    }
}

export default companyLoginService