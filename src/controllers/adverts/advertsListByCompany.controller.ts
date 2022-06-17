import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { CategoryAdvert } from '../../entities/categoryAdverts.entity'
import { AppError, handleError } from '../../errors/appError'
import paginationMiddleware from '../../middlewares/adverts/pagination.middleware'
import advertsListByCompanyService from '../../services/adverts/advertsListByCompany.service'

const advertsListByCompanyController = async (req: Request, res: Response) => {
    try {
        const {companyId} = req.params
        
        const adverts =  await advertsListByCompanyService(companyId) 
        
        let page = Number(req.query.page) 
        let perPage = Number(req.query.perPage)
        let category = req.query.category 
        
        //find category
        const categoryRepository = AppDataSource.getRepository(CategoryAdvert) 
        const categoryAds = await categoryRepository.find()
        const categoryAdsName = categoryAds.find(c => c.title === category)

        // const pagination = paginationMiddleware(adverts)
        
        if (!req.query.page){
            page = 1
        }
        
        if (!req.query.perPage){
            perPage = 8
        }        
        
        const initialElement: number = page * perPage - perPage
        
        // if (categoryAdsName){
        //     const adsBycategory = adverts.filter(ad => ad.category === categoryAdsName)
        //     return res.status(200).send(adsBycategory.splice(initialElement, perPage))             
        // }
        console.log("adverts=", adverts)
        
        const pagination = adverts.splice(initialElement, perPage)

        
        return res.status(200).send(pagination)
        
    } catch (error) {
        if (error instanceof AppError) {
            handleError(error, res);
        }
    }
}

export default advertsListByCompanyController