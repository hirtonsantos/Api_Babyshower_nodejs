import { Response, Request } from "express"
import chatArchiveService from "../../services/chat/chatArchive.service"

const chatArchiveController = async (req: Request, res: Response) => {
    try {

        const chat_id = req.params[0]

        const data = await chatArchiveService(chat_id)

        return res.json(data)
        
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }
    }
}

export default chatArchiveController