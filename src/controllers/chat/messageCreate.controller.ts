import { Response, Request } from "express"
import { AppError, handleError } from "../../errors/appError"
import createMessageService from "../../services/chat/createMessage.service"

const createMessageController = async (req: Request, res: Response) => {
    try {

        const other_parent_id = Number(req.params.id)
        const data = req.body
        const user_id = 2

        const messageData = await createMessageService(data, other_parent_id, user_id)

        return res.json(messageData)
        
    } catch (error) {
        if (error instanceof AppError) {
            handleError(error, res)
        }
    }
}

export default createMessageController