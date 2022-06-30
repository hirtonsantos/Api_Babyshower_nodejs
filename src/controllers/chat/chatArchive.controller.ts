import { Response, Request } from "express";
import { IArchived } from "../../interfaces/chat.interface";
import chatArchiveService from "../../services/chat/chatArchive.service";

const chatArchiveController = async (req: Request, res: Response) => {
  const chat_id = req.params.id;

  const dataArchive = req.body;

  const userId = req.decoded.id;

  const data = await chatArchiveService(
    dataArchive as IArchived,
    chat_id,
    userId
  );

  return res.status(204).json();
};

export default chatArchiveController;
