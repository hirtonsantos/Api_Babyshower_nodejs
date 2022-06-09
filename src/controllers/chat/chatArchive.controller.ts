import { Response, Request } from "express"
import chatArchiveService from "../../services/chat/chatArchive.service"

const chatArchiveController = async (req: Request, res: Response) => {
    try {

        const other_parent_id = "other_parent_id"
        const user_id = "user_id"

        const data = await chatArchiveService(user_id, other_parent_id)

        return res.json(data)
        
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }
    }
}

export default chatArchiveController