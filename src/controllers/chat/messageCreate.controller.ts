import { Response, Request } from "express"
import createMessageService from "../../services/chat/createMessage.service"

const createMessageController = async (req: Request, res: Response) => {
    try {

        const other_parent_id: string = "other_user00"
        const data = req.body
        const user_id = "hirton00"

        const messageData = await createMessageService(data, other_parent_id, user_id)

        return res.json(messageData)
        
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }
    }
}

export default createMessageController