import { Request, Response } from "express";
import companyDeleteService from "../../services/companies/companyDeleteSelf.service";

const companyDeleteController = async (req: Request, res: Response) => {
  const { id } = req.params;

  await companyDeleteService(id);

  return res.status(204).json();
};

export default companyDeleteController;
