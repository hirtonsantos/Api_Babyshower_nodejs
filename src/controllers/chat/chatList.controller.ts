import { Response, Request } from "express"
import chatListService from "../../services/chat/chatList.service"

const chatListController = async (req: Request, res: Response) => {
    try {

        const user_id = 2

        const data = await chatListService(user_id)

        return res.json(data)
        
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }
    }
}

export default chatListController