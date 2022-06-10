import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken"
import { AppError, handleError } from "../errors/appError";

export const authUser = (req: Request, res: Response, next: NextFunction) => {
    
    try {

        const token = req.headers.authorization?.split(" ")[1]
    
        if(!token) {
            throw new AppError(401, "No token found")
        }
        
        jwt.verify(token as string, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
            if(err){
                throw new AppError(401, "Invalid Token")
            }
            req.AdminId = decoded.id
            next()
        })

    } catch (err) {

        if (err instanceof AppError) {
            handleError(err, res)
        }
    }

}