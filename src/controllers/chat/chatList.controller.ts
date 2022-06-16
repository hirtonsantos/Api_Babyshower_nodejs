import { Response, Request } from "express"
import { AppError, handleError } from "../../errors/appError"
import chatListService from "../../services/chat/chatList.service"
import { getUserId } from "../../test/utils/getUserId"

const chatListController = async (req: Request, res: Response) => {
    try {

        const user_id = 1
        let page = req.query.page ? Number(req.query.page) : 1
        let perPage = req.query.per_page ? Number(req.query.per_page) : 8

        const data = await chatListService(user_id, page, perPage)

        let token = req.headers.authorization?.replace('Bearer', '').trim()!;

        getUserId(token, res)

        return res.json(data)
        
    } catch (error) {
        if (error instanceof AppError) {
            handleError(error, res)
        }
    }
}

export default chatListController