import { AppError } from "../../errors/appError"
import * as AWS from 'aws-sdk'
import { promisify } from "util"
import fs from "fs"
import path from "path"
import { compare } from "bcrypt"
import { Administrator } from "../../entities/administrators.entity"
import { AppDataSource } from "../../data-source"
import { DeleteObjectRequest } from "aws-sdk/clients/s3"

export const deleteImageService = async (url: string, idUser: string) => {
    //regex uuid
    const re = new RegExp(/[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i)
    const reEnd = new RegExp(/-image-[a-z0-9-.]+/i)
    const firstIndex = url.search(re)
    if(firstIndex === -1) throw new AppError(404, {Message: "file not found"})

    const key = url.substring(firstIndex)
    const idUserHash =  key.replace(re, "").replace(reEnd, "").substring(1)

    const admRepository = AppDataSource.getRepository(Administrator) 
    const admLogged = await admRepository.findBy({id: idUser})

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
        .then(res => console.log(res))

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