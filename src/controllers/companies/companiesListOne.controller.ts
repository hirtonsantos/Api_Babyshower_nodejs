import { Request, Response } from 'express'
import { AppError, handleError } from '../../errors/appError'
import companiesListOneService from '../../services/companies/companiesListOne.service'

const companyListOneController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params

        const company =  await companiesListOneService(id) 
        
        return res.status(200).send(company)
        
    } catch (error) {
        if (error instanceof AppError) {
            handleError(error, res);
        }
    }
}

export default companyListOneController