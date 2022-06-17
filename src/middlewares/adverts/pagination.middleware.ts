import { NextFunction, Request, Response } from "express";

const paginationMiddleware = (req: Request, res: Response, next: NextFunction) => {
        
    let page = Number(req.query.page) 
    let perPage = Number(req.query.perPage)
    
    if (!req.query.page){
        page = 1
    }
    
    if (!req.query.perPage){
        perPage = 8
    }        
    
    const initialElement: number = page * perPage - perPage
    
    const pagination = ads.splice(initialElement, perPage)

    return pagination
}

export default paginationMiddleware