import { Request, Response } from "express";
import { IFile } from "../../config/multer";
import { AppError } from "../../errors/appError";

export const postImageController = (req: Request, res: Response) => {
    const values: object[][] = Object.values(req.files as object)

    if (values.length > 1) throw new AppError(400, {Error: 'This route works for one file per each request'})

    let { key, location: url = ""} = values[0][0] as Express.MulterS3.File

    if(!url) url = `${process.env.APP_URL}/files/${key}` as string
    
    return res.json({msgSuccess: "File sent successfully!", url})
}