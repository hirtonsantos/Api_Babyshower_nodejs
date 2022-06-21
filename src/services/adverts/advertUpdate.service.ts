import { Request } from "express"
import { AppDataSource } from "../../data-source"
import { Advert } from "../../entities/adverts.entity"

const advertUpdateService = async (advertId: string, { validatedAdvert }: Request) => {  

    const adsRepository = AppDataSource.getRepository(Advert) 

    const advert = await adsRepository.findOneBy({id: advertId}) as Advert
    
    await adsRepository.update(advert!.id, {...validatedAdvert})

    return true
}

export default advertUpdateService