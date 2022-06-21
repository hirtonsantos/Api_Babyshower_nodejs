import { Request, Response } from "express"
import { deleteImageService } from "../../services/upload/deleteImage.service"

export const deleteImageController = async (req: Request, res: Response) => {
    const { key } = req.body

    const response = await deleteImageService(key, req.decoded.id as string)

    if(response){
        return res.status(204).json()
    }

    return res.json({Error: "Não deletado"})
}