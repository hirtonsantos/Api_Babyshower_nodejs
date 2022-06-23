import { Request, Response } from "express"
import { number } from "yup"
import { AppDataSource } from "../../data-source"
import { Advert } from "../../entities/adverts.entity"
import { CategoryAdvert } from "../../entities/categoryAdverts.entity"
import { AppError, handleError } from "../../errors/appError"
import { IAdvert } from "../../interfaces/advert"

const advertUpdateService = async (advertId: string, {validatedAd}: Request) => {  

    const adsRepository = AppDataSource.getRepository(Advert) 

    const categoryRepository = AppDataSource.getRepository(CategoryAdvert);

    const categories = await categoryRepository.find() as CategoryAdvert[]

    const category_ad = categories.find(
        (category) => category.title.toLowerCase() === validatedAd.category
    )

    validatedAd.category = category_ad as CategoryAdvert   

    await adsRepository.update(advertId, {...validatedAd})

    return true
}

export default advertUpdateService