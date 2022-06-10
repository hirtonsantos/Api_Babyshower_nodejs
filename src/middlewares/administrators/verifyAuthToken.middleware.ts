import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../../errors/appError";

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError(400, {"Error": "Missing authorization token."});
  }

  return verify(
    token,
    process.env.SECRET_KEY as string,
    (err: any, decoded: any ) => {
      if (err) {
        throw new AppError(401, {"Error": "Invalid Token."});
      }

      req.decoded = decoded ;

      return next();
    }
  );
};

export default validateToken;

// import {Request, Response, NextFunction} from "express";
// import jwt from "jsonwebtoken"
// import { AppError, handleError } from "../errors/appError";

// export const authToken = (req: Request, res: Response, next: NextFunction) => {
    
//     try {

//         const token = req.headers.authorization?.split(" ")[1]
    
//         if(!token) {
//             return {
//                 status: 401,
//                 message: "Missing authorization token"
//             }
//         }
        
//         jwt.verify(token as string, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
//             if(err){
//                 return {
//                     status: 401,
//                     message: "Invalid token"
//                 }
//             }
//             req.AdminId = decoded.id
//             next()
//         })

//     } catch (err) {

//         if (err instanceof AppError) {
//             handleError(err, res)
//         }
//     }

// }