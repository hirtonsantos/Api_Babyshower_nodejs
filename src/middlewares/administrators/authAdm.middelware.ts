import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../../errors/appError";

const validateAdmToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError(400, {"Error": "Missing authorization token"});
  }

  return verify(
    token,
    process.env.SECRET_KEY as string,
    (err: any, decoded: any ) => {
      if (err) {
        throw new AppError(401, {"Error": "Invalid Token"});
      }

      req.decoded = decoded ;

      return next();
    }
  );
};

export default validateAdmToken;