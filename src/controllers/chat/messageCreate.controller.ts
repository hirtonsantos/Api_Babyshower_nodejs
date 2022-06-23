import { Response, Request } from "express";
import { AppError, handleError } from "../../errors/appError";
import jwt from "jsonwebtoken";
import createMessageService from "../../services/chat/messageCreate.service";
import { getUserId } from "../../test/utils/getUserId";

const createMessageController = async (req: Request, res: Response) => {
  try {
    const other_parent_id = Number(req.params.id);
    const data = req.body;
    let user_id = 1;

    const messageData = await createMessageService(
      data,
      other_parent_id,
      user_id
    );

    return res.status(201).json(messageData);
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

export default createMessageController;
