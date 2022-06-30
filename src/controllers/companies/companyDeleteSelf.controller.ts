import { Request, Response } from "express";
import { AppError, handleError } from "../../errors/appError";
import { IParent } from "../../interfaces/parent";
import companyDeleteService from "../../services/companies/companyDeleteSelf.service";

const companyDeleteController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    /* let token = req.headers.authorization?.replace("Bearer", "").trim()!;

    const idToken = getUserId(token, res)!; */

    await companyDeleteService((req.decoded as IParent).id /* , idToken */);

    return res.status(204).json();
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

export default companyDeleteController;
