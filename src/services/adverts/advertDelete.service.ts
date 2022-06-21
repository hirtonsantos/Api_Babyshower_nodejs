import { AppDataSource } from "../../data-source"
import { Advert } from "../../entities/adverts.entity"

const advertDeleteService = async (advertId: string) => {
    const adsRepository = AppDataSource.getRepository(Advert) 

    const advert = await adsRepository.findOneBy({id: advertId}) as Advert
    // const adverts = await adsRepository.find()

    // const advert = adverts.find(ad => ad.id === advertId)

    await adsRepository.delete(advert!.id)

    return advert
}

export default advertDeleteService