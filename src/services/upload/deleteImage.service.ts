import { AppError } from "../../errors/appError"
import * as AWS from 'aws-sdk'
import { promisify } from "util"
import fs from "fs"
import path from "path"
import { compare } from "bcrypt"
import { Administrator } from "../../entities/administrators.entity"
import { AppDataSource } from "../../data-source"
import { DeleteObjectRequest } from "aws-sdk/clients/s3"

export const deleteImageService = async (key: string, idUser: string) => {
    const re = new RegExp(/^image-[a-z0-9-]+@/) //flag-name at left
    const reEnd = new RegExp(/.(?:[a-z]{3}|[a-z]{4})$/) //extensions at right
    const firstIndex = key.search(re)
    if(firstIndex === -1) throw new AppError(404, {Message: "file not found"})

    const idUserHash =  key.replace(re, "").replace(reEnd,"")

    const admRepository = AppDataSource.getRepository(Administrator) 
    const admLogged = await admRepository.findOneBy({id: idUser})

    if(!admLogged && !await compare(idUser, idUserHash)){
        throw new AppError(401, {Error: "You can't access information of another user"})
    }

    if(process.env.STORAGE_TYPE === "s3"){
        const s3 = new AWS.S3()

        s3.deleteObject({
            Bucket: process.env.BUCKET_NAME as string,
            Key: key
        } as DeleteObjectRequest)
        .promise()

    } else {
        const filePath = path.resolve(__dirname,"..","..","..","tmp","uploads",key)
        
        try{
            await promisify(fs.unlink)(
                path.resolve(__dirname,"..","..","..","tmp","uploads",key)
            )
        } catch {
            throw new AppError(404, {Message: "file not found"})
        }

    }
    return true
}