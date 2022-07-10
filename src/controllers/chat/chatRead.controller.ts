import { Response, Request } from "express";
import chatReadService from "../../services/chat/chatRead.service";

const chatReadController = async (req: Request, res: Response) => {
  const chat_id = req.params.id;

  const user_id = req.decoded.id;

  const data = await chatReadService(chat_id, user_id);

  return res.json(data);
};

export default chatReadController;
