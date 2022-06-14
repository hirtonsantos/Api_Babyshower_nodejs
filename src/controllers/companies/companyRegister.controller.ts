import { Request, Response } from "express";
import { AppError, handleError } from "../../errors/appError";
import companyRegisterService from "../../services/companies/companyRegister.service";

const companyRegisterController = async (req: Request, res: Response) => {
  try {
    const company = await companyRegisterService(req);

    return res.status(201).json(company);
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

export default companyRegisterController;
