import { Request, Response } from 'express'
import { number } from 'yup'
import { AppError, handleError } from '../../errors/appError'
import advertUpdateService from '../../services/adverts/advertUpdate.service'

const advertUpdateController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params

        const updateAd = req.body

        if (updateAd.apliedPrice){
            if (typeof updateAd.apliedPrice !== "number") {
                return res.status(400).json({"Error": "ApliedPrice must be a number"})
            }
        }

        const adKeys = Object.keys(updateAd)

        for(let i = 0; i < adKeys.length; i++){
            if (typeof updateAd[adKeys[i]] !== "string" && adKeys[i] !== "apliedPrice"){
                return res.status(400).json({"Error": "Your values must be a string"})
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