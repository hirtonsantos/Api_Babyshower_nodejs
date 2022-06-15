import { Request, Response } from 'express'
import companiesListService from '../../services/companies/companiesList.service'
import { AppError, handleError } from '../../errors/appError'

const companiesListController = async (req: Request, res: Response) => {
    try {

        const users = await companiesListService()

        let page = Number(req.query.page) 
        let perPage = Number(req.query.perPage)

        if (!req.query.page){
            page = 1
        }

        if (!req.query.perPage){
            perPage = 8
        }

        const initialElement: number = page * perPage - perPage
        const finalElement: number = initialElement + perPage

        const pagination = users.splice(initialElement, perPage)

        const newPagination = pagination.map((company) => {
            return {
                "id": company.id, 
                "email": company.email, 
                "username": company.username,
                "cnpj": company.cnpj, 
                "phone": company.phone, 
                "razaoSocial": company.razaoSocial,
                "logoImage": company.logoImage, 
                "adverts": `/adverts/byCompany/${company.id}`
            }
        })         

        return res.send(newPagination)
        
    } catch (error) {

        if (error instanceof AppError) {
            handleError(error, res)
        }
        
    }
}

export default companiesListController