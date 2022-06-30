import { Response, Request } from "express";
import chatListService from "../../services/chat/chatList.service";

const chatListController = async (req: Request, res: Response) => {
  const user_id = 1;
  let page = req.query.page ? Number(req.query.page) : 1;
  let perPage = req.query.per_page ? Number(req.query.per_page) : 8;

  const data = await chatListService(user_id, page, perPage);

  let token = req.headers.authorization?.replace("Bearer", "").trim()!;

  return res.json(data);
};

export default chatListController;
