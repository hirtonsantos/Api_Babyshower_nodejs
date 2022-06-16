import { Request, Response } from "express";
import { postImageService } from "../../services/upload/postImage.service";

export const postImageController = (req: Request, res: Response) => {
    const response = postImageService(Object.values(req.files as object))

    return res.json(response)
}