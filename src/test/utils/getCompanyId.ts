import { Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../../errors/appError";

export const getCompanyId = (token: string, res: Response) => {

  if (!token) {
    throw new AppError(400, { Error: "Missing authorization token" });
  }

  let id

     jwt.verify(
        token as string,
      process.env.SECRET_KEY as string,
      (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({
            error: {
              name: "JsonWebTokenError",
              message: "Invalid Token",
            },
          });
        }
        id = decoded.id
        return decoded.id;
      }
    );
    return id
}