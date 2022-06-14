import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/appError";
import { Administrator } from "../../entities/administrators.entity";
import { AppDataSource } from "../../data-source";
import { Company } from "../../entities/companies.entity";
import { ICompany } from "../../test";

const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const admRepository = AppDataSource.getRepository(Administrator) 
    const companiesRepository = AppDataSource.getRepository(Company) 
    const {id} = req.params 

    const adms = await admRepository.find()
    
    const companies = await companiesRepository.find()

    const admLogged = adms.find(adm => adm.id === req.decoded.id)

    const companyLogged = companies.find(company => company.id === req.decoded.id)

    if (!companies.find(company => company.id === id)){
        throw new AppError(401, {Message: "Company not found"})
    }

    if (admLogged){
        return next()
    }

    if (companyLogged?.id != id){
        throw new AppError(403, {Error: "You can't access information of another company"})
    }

    return next()        
}

export default verifyToken