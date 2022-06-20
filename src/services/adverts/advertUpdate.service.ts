import { Request } from "express"
import { AppDataSource } from "../../data-source"
import { Advert } from "../../entities/adverts.entity"

const advertUpdateService = async (advertId: string, { validatedAdvert }: Request) => {  

    const adsRepository = AppDataSource.getRepository(Advert) 

    const advert = await adsRepository.findOneBy({id: advertId})

    return advert

}

export default advertUpdateService