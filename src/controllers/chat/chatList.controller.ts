import { Response, Request } from "express";
import chatListService from "../../services/chat/chatList.service";

const chatListController = async (req: Request, res: Response) => {
  const user_id = Number(req.decoded.id);
  let archived = req.query.archived || false;

  const data = await chatListService(user_id, archived as boolean);

  return res.json(data);
};

export default chatListController;
