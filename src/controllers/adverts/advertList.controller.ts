import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { Advert } from '../../entities/adverts.entity'
import { CategoryAdvert } from '../../entities/categoryAdverts.entity'
import { AppError, handleError } from '../../errors/appError'
import advertsListService from '../../services/adverts/advertList.service'

const advertsListController = async (req: Request, res: Response) => {
    try {
        
        const adverts =  await advertsListService() as Advert[]
        
        let page = Number(req.query.page) 
        let perPage = Number(req.query.perPage)
        let category = req.query.category?.toString() 
        
        //find category
        const categoryRepository = AppDataSource.getRepository(CategoryAdvert) 
        const categoryAds = await categoryRepository.find()
        const categoryAdsEnt = categoryAds.find(
            adCategory => adCategory.title.toLowerCase() === category?.toLowerCase()
        )

        if (!req.query.page){
            page = 1
        }
        
        if (!req.query.perPage){
            perPage = 8
        }        
        
        const initialElement: number = page * perPage - perPage
        
        if (categoryAdsEnt){
            const adsBycategory = adverts.filter(ad => ad.category.title === categoryAdsEnt.title)
            return res.status(200).send(adsBycategory)             
        }
        
        const pagination = adverts.splice(initialElement, perPage)
        
        return res.status(200).send(pagination)
        
    } catch (error) {
        if (error instanceof AppError) {
            handleError(error, res);
        }
    }
}

export default advertsListController