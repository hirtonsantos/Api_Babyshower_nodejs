import { AppDataSource } from "../../data-source"
import { Advert } from "../../entities/adverts.entity"

const advertListOneService = async (advertId: string) => {

    const adsRepository = AppDataSource.getRepository(Advert) 

    const ads = await adsRepository.find()

    const advert = ads.find(ad => ad.id === advertId) 

    return advert
}

export default advertListOneService