import { Request } from "express";
import { AppDataSource } from "../../data-source";
import { Administrator } from "../../entities/administrators.entity";
import jwt from "jsonwebtoken";
import { AppError } from "../../errors/appError";

import * as dotenv from "dotenv";

dotenv.config();

const administratorLoginService = async ({ validatedAdmin }: Request) => {
  const administratorRepository = AppDataSource.getRepository(Administrator);

  const administrators = await administratorRepository.find();

  const administrator = administrators.find(
    (adm) =>
      adm.email === validatedAdmin.email ||
      adm.username === validatedAdmin.username
  );

  if (
    !administrator ||
    !(await administrator.comparePwd(validatedAdmin.password))
  ) {
    throw new AppError(401, { Error: "User not authorized" });
  }

  const token = jwt.sign(
    { id: validatedAdmin?.id || administrator.id },
    String(process.env.SECRET_KEY),
    { expiresIn: process.env.EXPIRES_IN }
  );

  return {
    id: validatedAdmin?.id || administrator.id,
    access_token: token,
  };
};
export default administratorLoginService;
