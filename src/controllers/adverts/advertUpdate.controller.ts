import { Request, Response } from 'express'
import { number } from 'yup'
import { AppError, handleError } from '../../errors/appError'
import advertUpdateService from '../../services/adverts/advertUpdate.service'

const advertUpdateController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params

        const updateAd = req.body

        if (typeof updateAd.apliedPrice !== "number") {
            return res.status(400).json()
        }

        const adKeys = Object.keys(updateAd).sort()
        adKeys.shift()

        for(let i = 0; i < adKeys.length; i++){
            if (typeof updateAd[adKeys[i]] !== "string"){
                return res.status(400).json()
            }
        }

        await advertUpdateService(id, req)

        return res.status(204).json()
        
    } catch (error) {
        if (error instanceof AppError) {
            handleError(error, res);
        }
    }
}

export default advertUpdateController