import { Request, Response } from "express"
import companyLoginService from "../../services/companies/companyLogin.service"

const companyLoginController = async (req: Request, res: Response) => {
    try {

        const {email, password} = req.body

        const token = await companyLoginService({email, password})
        
    } catch (error) {
        
    }
}

export default companyLoginController