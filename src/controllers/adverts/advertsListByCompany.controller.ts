import { Request, Response } from 'express'
import { AppError, handleError } from '../../errors/appError'
import advertsListByCompanyService from '../../services/adverts/advertsListByCompany.service'

const advertsListByCompanyController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params

        const adverts =  await advertsListByCompanyService(id) 
        
        return res.status(200).send(adverts)
        
    } catch (error) {
        if (error instanceof AppError) {
            handleError(error, res);
        }
    }
}

export default advertsListByCompanyController