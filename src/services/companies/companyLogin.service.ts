import {ICompanyLogin} from "../../interfaces/companies"
import { AppDataSource } from "../../data-source"
import { Company } from "../../entities/companies.entity"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { AppError, handleError } from "../../errors/appError"
import { Request } from "express"


const companyLoginService = async ({email, password}: ICompanyLogin) => {
    try{
        const companyRepository = AppDataSource.getRepository(Company)

        const companies = await companyRepository.find()
        // console.log("companies=", companies)

        const account = companies.find(company => company.email === email)
        // console.log("account=", account)

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
    } catch (error){

        return {msg: "Something went wrong"}
    }
}

export default companyLoginService