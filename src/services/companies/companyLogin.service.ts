import {ICompanyLogin} from "../../interfaces/companies"
import { AppDataSource } from "../../data-source"
import { Company } from "../../entities/companies.entity"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const companyLoginService = async ({email, password}: ICompanyLogin) => {
    try {
        const companyRepository = AppDataSource.getRepository(Company)

        const companies = await companyRepository.find()

        const account = companies.find(company => company.email === email)

        if (!account) {
            return {
                status: 404,
                message: "Account not found"
            }
        }

        if(!bcrypt.compareSync(password, account.passwordHash)){
            return {
                status: 401,
                message: {message: "Invalid credentials"}
            }
        }

        const token: string = jwt.sign(
                {email: account.id},
                String(process.env.SECRET_KEY),
                {expiresIn: process.env.EXPIRES_IN}
            )
        // console.log(token)

        return token
        
    } catch (error) {
        return {
            status: 400,
            message: "Something went wrong"
        }        
    }
}

export default companyLoginService