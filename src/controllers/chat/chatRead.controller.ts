import { Response, Request } from "express";
import { AppError, handleError } from "../../errors/appError";
import chatReadService from "../../services/chat/chatRead.service";

const chatReadController = async (req: Request, res: Response) => {
  try {
    const chat_id = req.params.id;
    let page = req.query.page ? Number(req.query.page) : 1;
    let perPage = req.query.per_page ? Number(req.query.per_page) : 8;

    let token = req.headers.authorization?.replace("Bearer", "").trim()!;

    const user_id = req.decoded.id;

    const data = await chatReadService(chat_id, user_id, page, perPage);

    return res.json(data);
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

export default chatReadController;
