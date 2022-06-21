import { AlreadyHasActiveConnectionError } from "typeorm"
import { AppDataSource } from "../../data-source"
import { Advert } from "../../entities/adverts.entity"
import { Company } from "../../entities/companies.entity"

const advertsListService = async () => {

    const adsRepository = AppDataSource.getRepository(Advert) 

    //find company
    const adverts = await adsRepository.find()


    return adverts as Advert[]
}

export default advertsListService