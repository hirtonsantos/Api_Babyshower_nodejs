import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/appError";
import { Administrator } from "../../entities/administrators.entity";
import { AppDataSource } from "../../data-source";
import { Company } from "../../entities/companies.entity";
import { Advert } from "../../entities/adverts.entity";

const verifyAdsCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const admRepository = AppDataSource.getRepository(Administrator) 
    const companiesRepository = AppDataSource.getRepository(Company) 
    const adsRepository = AppDataSource.getRepository(Advert) 

    const loggedId = req.decoded.id 
    const {id} = req.params 

    const ads = await adsRepository.find()
    const adms = await admRepository.find()
    const companies = await companiesRepository.find()

    const advert = ads.find(ad => ad.id === id)
    const admLogged = adms.find(adm => adm.id === loggedId)
    const companyLogged = companies.find(company => company.id === loggedId)

    const companyAds = companyLogged?.adverts
    const companyAdsId = companyAds?.map(ad => ad.id)

    if (!ads.find(ad => ad.id === advert?.id)){
        throw new AppError(404, {Message: "Advert not found"})
    }

    if (admLogged){
        return next()
    }

    if (!companyAdsId?.includes(id)){
        throw new AppError(403, {Error: "You can't access information of another company"})
    }

    return next()        
}

export default verifyAdsCompany