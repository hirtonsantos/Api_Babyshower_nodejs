import multer, { StorageEngine } from "multer"
import path from "path"
import * as AWS from 'aws-sdk'
import multerS3 from "multer-s3"
import { Request } from "express"
import * as dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import * as bcrypt from "bcrypt";

dotenv.config();

export interface IFile extends Express.Multer.File {
    key: string
}

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024

const storageTypes = {
    local: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname,"..","..", "tmp/uploads"));
      },
      filename: (req: Request, file: IFile, cb: any) => {
        const id = uuid()
        const idUser = req.decoded.id
        file.key = `${id}-${bcrypt.hashSync(idUser as string, 10)}-${file.fieldname+file.mimetype.replace("image/",".")}`

        cb(null, file.key)
      },
    }),
    s3: multerS3({
      s3: new AWS.S3(),
      bucket: process.env.BUCKET_NAME as string,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: "public-read",
      key: (req: Request, file, cb) => {
        const id = uuid()
        const idUser = req.decoded.id
        const fileName = `${id}-${bcrypt.hashSync(idUser as string, 10)}-${file.fieldname}`

        cb(null, fileName)
      },
    }),
};

const type = process.env.STORAGE_TYPE as string

export default {
    dest: path.resolve(__dirname,"..","..", "tmp/uploads"),
    storage: type === "local" || process.env.NODE_ENV === "test" ?
     storageTypes["local"] : storageTypes["s3"],
    limits: {
      fileSize: MAX_SIZE_TWO_MEGABYTES,
    },
    fileFilter: (_: Request, file: any, cb: any) => {
      const allowedMimes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
  
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type."));
      }
    },
  };
