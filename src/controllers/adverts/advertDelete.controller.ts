import { Request, Response } from 'express'
import { AppError, handleError } from '../../errors/appError'
import advertDeleteService from '../../services/adverts/advertListOne.service'

const advertDeleteController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params

        const ad = await advertDeleteService(id)
        
        return res.status(204).json()
        
    } catch (error) {
        if (error instanceof AppError) {
            handleError(error, res);
        }
    }
}

export default advertDeleteController