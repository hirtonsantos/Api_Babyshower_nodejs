import { Request, Response } from "express";
import companyUpdateService from "../../services/companies/companyUpdate.service";

const companyUpdateController = async (req: Request, res: Response) => {
  const { id } = req.params;

  await companyUpdateService(id, req);

  return res.status(204).json();
};

export default companyUpdateController;
