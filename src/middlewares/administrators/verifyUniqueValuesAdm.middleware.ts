import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../data-source";

import { Administrator } from "../../entities/administrators.entity";

const verifyUniqueValuesAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const admRepository = AppDataSource.getRepository(Administrator);

  const usernameExists = await admRepository.findOne({
    where: { username: req.validated.username },
  });

  if (usernameExists) {
    return res.status(409).json({
      "Error": "Key email or username already exists",
    });
  }

  const emailExists = await admRepository.findOne({
    where: { email: req.validated.email },
  });

  if (emailExists) {
    return res.status(409).json({
      "Error": "Key email or username already exists",
    });
  }
  return next();
}

export default verifyUniqueValuesAdmin;