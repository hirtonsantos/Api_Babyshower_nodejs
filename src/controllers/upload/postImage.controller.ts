import { Request, Response } from "express";
import { IFile } from "../../config/multer";

export const postImageController = (req: Request, res: Response) => {
    let { originalname: name, size, key, location: url = ""} = req.file as Express.MulterS3.File
    if(!url) url = `${process.env.APP_URL}/files/${key}` as string
    
    return res.json({name, size, key, url})//res.json({name, size, key, url})
}