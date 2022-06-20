import { AppDataSource } from "../../data-source"
import { Advert } from "../../entities/adverts.entity"
import { Company } from "../../entities/companies.entity"

const advertListOneService = async (advertId: string) => {

    const adsRepository = AppDataSource.getRepository(Advert) 

    const advert = await adsRepository.findOneBy({id: advertId})

    return advert
}

export default advertListOneService