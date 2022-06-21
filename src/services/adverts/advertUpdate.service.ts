import { Request } from "express"
import { AppDataSource } from "../../data-source"
import { Advert } from "../../entities/adverts.entity"
import { CategoryAdvert } from "../../entities/categoryAdverts.entity"
import { AppError } from "../../errors/appError"

const advertUpdateService = async (advertId: string, {validatedAd}: Request) => {  

    const adsRepository = AppDataSource.getRepository(Advert) 

    const categoryRepository = AppDataSource.getRepository(CategoryAdvert);
    const categories = await categoryRepository.find();

    const category = categories.find(
        (category) => category.title.toLowerCase() === validatedAd.category?.toLocaleLowerCase()
    );
    
    const advert = await adsRepository.findOneBy({id: advertId})

    const newAd = {
        ...validatedAd
    }
    
    

    // await adsRepository.update(advertId, {...newAdsInfo})

    return true
}

export default advertUpdateService