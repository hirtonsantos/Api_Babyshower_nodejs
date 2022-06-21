import { Request, Response } from "express";
import companyLoginService from "../../services/companies/companyLogin.service";
import { AppError, handleError } from "../../errors/appError";
import { ICompanyLogin } from "../../interfaces/companies";

const companyLoginController = async (req: Request, res: Response) => {
  try {
    const access_token = await companyLoginService(
      req.validated as ICompanyLogin
    );

    return res.status(200).json({ access_token });
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

export default companyLoginController;
