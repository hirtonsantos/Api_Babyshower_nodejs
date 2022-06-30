import { Response, Request } from "express";
import chatArchiveService from "../../services/chat/chatArchive.service";

const chatArchiveController = async (req: Request, res: Response) => {
  const chat_id = req.params.id;

  const dataArchive = req.body;

  const userId = req.decoded.id;

  const data = await chatArchiveService(dataArchive, chat_id, userId);

  return res.status(204).json(data);
};

export default chatArchiveController;
