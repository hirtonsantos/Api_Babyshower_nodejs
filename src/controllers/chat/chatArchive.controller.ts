import { Response, Request } from "express";
import { AppError, handleError } from "../../errors/appError";
import chatArchiveService from "../../services/chat/chatArchive.service";
import { getUserId } from "../../test/utils/getUserId";


const chatArchiveController = async (req: Request, res: Response) => {
  try {
    const chat_id = req.params.id;

    const dataArchive = req.body

    let token = req.headers.authorization?.replace('Bearer', '').trim()!;

    const userId = getUserId(token, res)

    const data = await chatArchiveService(dataArchive, chat_id, userId)

    return res.status(204).json(data)
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

export default chatArchiveController;
