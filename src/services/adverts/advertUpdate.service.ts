import { Request, Response } from "express"
import { AppDataSource } from "../../data-source"
import { Advert } from "../../entities/adverts.entity"
import { CategoryAdvert } from "../../entities/categoryAdverts.entity"
import { AppError, handleError } from "../../errors/appError"
import { IAdvert } from "../../interfaces/advert"

const advertUpdateService = async (advertId: string, updateAdvert: IAdvert, res: Response) => {  

    const adsRepository = AppDataSource.getRepository(Advert) 

    const categoryRepository = AppDataSource.getRepository(CategoryAdvert);
    const categories = await categoryRepository.find() as CategoryAdvert[]

    console.log("updateAdvert=", updateAdvert)
    const category_ad = categories.find(
        (category) => category.title.toLowerCase() === updateAdvert.category.toLowerCase()
    )

    updateAdvert.category = category_ad as CategoryAdvert   

    await adsRepository.update(advertId, {...updateAdvert})

    return true
}

export default advertUpdateService