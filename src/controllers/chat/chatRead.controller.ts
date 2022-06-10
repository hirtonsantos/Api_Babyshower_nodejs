import { Response, Request } from "express"
import chatReadService from "../../services/chat/chatRead.service"

const chatReadController = async (req: Request, res: Response) => {
    try {

        const chat_id = req.params.id
        console.log(chat_id)
        const user_id = 2

        const data = await chatReadService(chat_id, user_id)

        return res.json(data)
        
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }
    }
}

export default chatReadController