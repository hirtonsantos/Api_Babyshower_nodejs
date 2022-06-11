import { Request, Response } from "express";
import { AppError, handleError } from "../../errors/appError";
import administratorLoginService from "../../services/administrators/administratorsLogin.service";

const administratorLoginController = async (req: Request, res: Response) => {
  try {
    const administrator = await administratorLoginService(req);

    return res.status(200).json(administrator);
  } catch (error) {
    handleError(error, res);
  }
};

export default administratorLoginController;
