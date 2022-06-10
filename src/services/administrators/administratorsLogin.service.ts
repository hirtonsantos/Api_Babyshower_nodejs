import { Request } from "express";
import { AppDataSource } from "../../data-source";
import { Administrator } from "../../entities/administrators.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../errors/appError";

const administratorLoginService = async ({ validated }: Request) => {
  const companyRepository = AppDataSource.getRepository(Administrator);

  const account = companyRepository.findOne({
    where: {
      email: validated.email || validated.username,
    },
  });

  if (!account) {
    // throw new AppError(401, { Error: "User not authorized" });
  }
};

export default administratorLoginService;
