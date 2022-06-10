import { Response, Request } from "express"
import { AppError, handleError } from "../../errors/appError"
import chatListService from "../../services/chat/chatList.service"

const chatListController = async (req: Request, res: Response) => {
    try {

        const user_id = 2

        const data = await chatListService(user_id)

        return res.json(data)
        
    } catch (error) {
        if (error instanceof AppError) {
            handleError(error, res)
        }
    }
}

export default chatListController