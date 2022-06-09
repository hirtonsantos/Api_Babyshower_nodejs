import { Response, Request } from "express"
import chatReadService from "../../services/chat/chatRead.service"

const chatReadController = async (req: Request, res: Response) => {
    try {

        const other_parent_id = "other_user00"
        const user_id = "hirton00"

        const data = await chatReadService(user_id, other_parent_id)

        return res.json(data)
        
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }
    }
}

export default chatReadController