import { AppDataSource } from "../../data-source"
import { Advert } from "../../entities/adverts.entity"

const advertDeleteService = async (advertId: string) => {
    const adsRepository = AppDataSource.getRepository(Advert) 

    const advert = await adsRepository.findOneBy({id: advertId}) as Advert

    await adsRepository.delete(advert!.id)

    return advert
}

export default advertDeleteService