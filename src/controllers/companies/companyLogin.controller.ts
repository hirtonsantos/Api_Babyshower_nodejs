import { Request, Response } from "express"
import companyLoginService from "../../services/companies/companyLogin.service"
import { AppError, handleError } from "../../errors/appError"

const companyLoginController = async (req: Request, res: Response) => {
    try {

        const {email, password} = req.body

        const token = await companyLoginService({email, password})

        return res.status(201).json({token})
        
    } catch (error) {
        
        if (error instanceof AppError) {
            handleError(error, res)
        }
        
    }
}

export default companyLoginController