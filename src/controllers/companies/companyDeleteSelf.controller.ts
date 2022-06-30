import { Request, Response } from "express";
import { AppError, handleError } from "../../errors/appError";
import companyDeleteService from "../../services/companies/companyDeleteSelf.service";

const companyDeleteController = async (req: Request, res: Response) => {
  const { id } = req.params;

  /* let token = req.headers.authorization?.replace("Bearer", "").trim()!;

    const idToken = getUserId(token, res)!; */

  await companyDeleteService(id /* , idToken */);

  return res.status(204).json();
};

export default companyDeleteController;
