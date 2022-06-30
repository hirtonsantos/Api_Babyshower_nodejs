import { Request, Response } from "express";
import { AppError, handleError } from "../../errors/appError";
import companyUpdateService from "../../services/companies/companyUpdate.service";
/* import { getUserId as getCompanyId } from "../../test/utils/getUserId"; */

const companyUpdateController = async (req: Request, res: Response) => {
  const { id } = req.params;

  /* let token = req.headers.authorization?.replace("Bearer", "").trim()!; */

  /* const idToken = getCompanyId(token, res)!; */

  await companyUpdateService(id, /* idToken,  */ req);

  return res.status(204).json();
};

export default companyUpdateController;
