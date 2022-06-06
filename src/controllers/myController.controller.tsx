import { Request, Response } from 'express'

const myController = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        if (error instanceof Error){
            throw new Error(error.message)
        }
    }
}

export default myController