import { Request, Response } from 'express'
import { AppError, handleError } from '../../errors/appError'
import advertUpdateService from '../../services/adverts/advertUpdate.service'

const advertUpdateController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params

        const updateAd = req.body

        await advertUpdateService(id, updateAd, res)

        return res.status(204).json()
        
    } catch (error) {
        if (error instanceof AppError) {
            handleError(error, res);
        }
    }
}

export default advertUpdateController