import { Request, Response } from "express";

import administratorLoginService from "../../services/administrators/administratorsLogin.service";

const administratorLoginController = async (req: Request, res: Response) => {
  const administrator = await administratorLoginService(req);

  return res.status(200).json(administrator);
};

export default administratorLoginController;
