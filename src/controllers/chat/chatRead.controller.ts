import { Response, Request } from "express";
import { AppError, handleError } from "../../errors/appError";
import chatReadService from "../../services/chat/chatRead.service";
import { getUserId } from "../../test/utils/getUserId";

const chatReadController = async (req: Request, res: Response) => {
  try {
    const chat_id = req.params.id;

    const user_id = 1;

    const data = await chatReadService(chat_id, user_id);

    return res.json(data);
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

export default chatReadController;
