import { Response, Request } from "express"
import { AppError, handleError } from "../../errors/appError"
import chatArchiveService from "../../services/chat/chatArchive.service"

const chatArchiveController = async (req: Request, res: Response) => {
    try {

        const chat_id = req.params[0]

        const data = await chatArchiveService(chat_id)

        return res.json(data)
        
    } catch (error) {
        if (error instanceof AppError) {
            handleError(error, res)
        }
    }
}

export default chatArchiveController