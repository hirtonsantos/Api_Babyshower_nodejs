import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../data-source";

import { Administrator } from "../../entities/administrators.entity";
import { IAdministratorRegister } from "../../interfaces/administrators";

const verifyUniqueValuesAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const admRepository = AppDataSource.getRepository(Administrator);

  const {username, email} = req.validated as IAdministratorRegister

  const usernameExists = await admRepository.findOne({
    where: { username: username },
  });

  if (usernameExists) {
    return res.status(409).json({
      error: "Key email or username already exists",
    });
  }

  const emailExists = await admRepository.findOne({
    where: { email: email },
  });

  if (emailExists) {
    return res.status(409).json({
      error: "Key email or username already exists",
    });
  }
  return next();
}

export default verifyUniqueValuesAdmin;