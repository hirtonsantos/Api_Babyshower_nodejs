import { Request, Response } from "express";
import advertRegisterService from "../../services/adverts/advertRegister.service";

const advertRegisterController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const advert = await advertRegisterService(req, id);

  return res.status(201).json(advert);
};

export default advertRegisterController;
