import { AppError } from "../../errors/appError"
import * as AWS from 'aws-sdk'
import { promisify } from "util"
import fs from "fs"
import path from "path"

export const deleteImageService = async (url: string) => {
    //regex uuid
    const re = new RegExp(/[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i)
    const firstIndex = url.search(re)
    if(firstIndex === -1){
        throw new AppError(404, {Message: "file not found"})
    }

    const key = url.substring(firstIndex)

    if(process.env.STORAGE_TYPE === "s3"){
        const s3 = new AWS.S3()

        /* s3.deleteObject(
            {Bucket: process.env.BUCKET_NAME,
            Key: key}
        )
        .promise()
        .then(res => console.log(res)) */

    } else {
        await promisify(fs.unlink)(
            path.resolve(__dirname,"..","..","..","tmp","uploads",key)
        )
    }
    return true
}