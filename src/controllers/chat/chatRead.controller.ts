import { Response, Request } from "express"
import chatReadService from "../../services/chat/chatRead.service"

interface IProps {
    page: string;
    perPage: string
}

const chatReadController = async (req: Request, res: Response) => {
    try {

        const chat_id = req.params.id
        let page = Number(req.query.page) || 1
        let perPage = Number(req.query.per_page) || 8
        console.log("per", perPage)
        const user_id = 2


        const data = await chatReadService(chat_id, user_id, page, perPage)

        return res.json(data)
        
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }
    }
}

export default chatReadController