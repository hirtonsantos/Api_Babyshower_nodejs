import { Request } from "express";
import { AppDataSource } from "../../data-source";
import { Administrator } from "../../entities/administrators.entity";
import jwt from "jsonwebtoken";
import { AppError } from "../../errors/appError";

import * as dotenv from "dotenv";
import { compare } from "bcrypt";

dotenv.config();

const administratorLoginService = async ({ validatedAdmin }: Request) => {
  const administratorRepository = AppDataSource.getRepository(Administrator);

  const administrators = await administratorRepository.find();

  const administrator = administrators.find(
    (adm) =>
      adm.username === validatedAdmin.username ||
      adm.email === validatedAdmin.email
  );

  if (!administrator) {
    throw new AppError(401, { Error: "User not authorized" });
  }

  compare(
    validatedAdmin.passwordHash,
    administrator.passwordHash,
    (error, result) => {
      if (error) {
        console.log("YES");
      }
    }
  );

  const token = jwt.sign(
    { id: administrator.id },
    String(process.env.SECRET_KEY),
    { expiresIn: process.env.EXPIRES_IN }
  );

  return {
    id: administrator.id,
    access_token: token,
  };
};
export default administratorLoginService;
