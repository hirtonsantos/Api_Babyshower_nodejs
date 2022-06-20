import { Request, Response } from 'express'
import { AppError, handleError } from '../../errors/appError'
import advertListOneService from '../../services/adverts/advertListOne.service'

const advertListOneController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params

        const advert =  await advertListOneService(id)
        
        return res.status(200).send(advert)
        
    } catch (error) {
        if (error instanceof AppError) {
            handleError(error, res);
        }
    }
}

export default advertListOneController
