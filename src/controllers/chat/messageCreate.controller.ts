import { Response, Request } from "express";
import { AppError, handleError } from "../../errors/appError";
import createMessageService from "../../services/chat/messageCreate.service";

const createMessageController = async (req: Request, res: Response) => {
  const other_parent_id = Number(req.params.id);
  const data = req.body;
  let user_id = Number(req.decoded.id);

  let token = req.headers.authorization?.replace("Bearer", "").trim()!;

  const messageData = await createMessageService(
    data,
    other_parent_id,
    user_id
  );

  return res.status(201).json(messageData);
};

export default createMessageController;
