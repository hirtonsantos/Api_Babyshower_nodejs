import {ICompanyLogin} from "../../interfaces/companies"
import { AppDataSource } from "../../data-source"
import { Company } from "../../entities/companies.entity"
import jwt from "jsonwebtoken"
import { AppError, handleError } from "../../errors/appError"


const companyLoginService = async ({email, password}: ICompanyLogin) => {
    try {
        const companyRepository = AppDataSource.getRepository(Company)

        const companies = await companyRepository.find()

        const account = companies.find(company => company.email === email)

        if(!(await account?.comparePwd(password))){
            return{
                status: 401,
                message: {message: "Invalid credentials"}
            }
        }

        const token: string = jwt.sign(
            {email: email},
            String(process.env.SECRET_KEY),
            {expiresIn: process.env.EXPIRES_IN}
        )

        return token
        
    } catch (error) {
        return {error: error}       
    }
}

export default companyLoginService