import { Request, Response } from "express"
import { deleteImageService } from "../../services/upload/deleteImage.service"

export const deleteImageController = async (req: Request, res: Response) => {
    const { url } = req.body

    const response = await deleteImageService(url)
    console.log(response)

    if(response){
        return res.status(204).json()
    }

    return res.json({Error: "Não deletado"})
}