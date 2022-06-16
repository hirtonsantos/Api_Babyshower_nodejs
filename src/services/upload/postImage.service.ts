import { AppError } from "../../errors/appError"

export const postImageService = (files: object[][]) => {
    if (files.length > 1) throw new AppError(400, {Error: 'This route works for one file per each request'})

    let { key, location: url = ""} = files[0][0] as Express.MulterS3.File

    if(!url) url = `${process.env.APP_URL}/files/${key}` as string
    
    return {msgSuccess: "File sent successfully!", url}

}