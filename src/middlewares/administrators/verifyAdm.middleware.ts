import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/appError";
import { Administrator } from "../../entities/administrators.entity";
import { AppDataSource } from "../../data-source";

const verifyIfAdm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const userRepository = AppDataSource.getRepository(Administrator) 

    const adms = await userRepository.find()

    const accountLogged = adms.find(adm => adm.email === req.decoded.id)

    if (!accountLogged){
        throw new AppError(401, {Error: "You are not allowed to access this information"})
    }
        
    return next()
}

export default verifyIfAdm

