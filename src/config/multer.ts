import multer, { StorageEngine } from "multer";
import path from "path";
import * as AWS from "aws-sdk";
import multerS3 from "multer-s3";
import { Request } from "express";
import * as dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import * as bcrypt from "bcrypt";
import { AppError } from "../errors/appError";

dotenv.config();

export interface IFile extends Express.Multer.File {
  key: string;
}

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024;

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: async (req: Request, file: IFile, cb: any) => {
      const idUser = req.decoded.id?.toString() as string;
      const idUserHash = await bcrypt.hash(idUser, 10);
      file.key = `${file.fieldname}@${idUserHash}${file.mimetype.replace(
        "image/",
        "."
      )}`;

      cb(null, file.key);
    },
  }),
  s3: multerS3({
    s3: new AWS.S3(),
    bucket: process.env.BUCKET_NAME as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: async (req: Request, file, cb) => {
      const idUser = req.decoded.id?.toString() as string;
      const idUserHash = await bcrypt.hash(idUser, 10);
      const fileName = `${file.fieldname}@${idUserHash}`;

      cb(null, fileName);
    },
  }),
};

const type = process.env.STORAGE_TYPE as string;

export default {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage:
    type === "local" || process.env.NODE_ENV === "test"
      ? storageTypes["local"]
      : storageTypes["s3"],
  limits: {
    fileSize: MAX_SIZE_TWO_MEGABYTES,
  },
  fileFilter: (_: Request, file: any, cb: any) => {
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, { Error: "Invalid file type" }));
    }
  },
};
