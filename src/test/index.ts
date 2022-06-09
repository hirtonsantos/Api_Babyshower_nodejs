import { faker } from "@faker-js/faker";
import { Companie } from "../entities/companies.entity";
import jwt from "jsonwebtoken";

export interface ICompany extends Partial<Companie> {
  password: string;
}

const generateCompany = (): Partial<ICompany> => {
  const razaoSocial = faker.company.companyName().toUpperCase();
  const username = faker.internet.userName(razaoSocial).toLowerCase();
  const email = faker.internet.email(razaoSocial).toLocaleLowerCase();
  const password = faker.random.numeric(8);
  const cnpj = faker.random.numeric(14);

  return { razaoSocial, username, email, password, cnpj };
};

const generateAdvert = () => {};

const generateAdministrator = () => {};

const generateMessage = () => {};

const generateToken = (id: string): string => {
  const token = jwt.sign({ id: id }, process.env.SECRET_KEY as string, {
    expiresIn: process.env.EXPIRES_IN,
  });

  return token;
};

export {
  generateCompany,
  generateAdvert,
  generateAdministrator,
  generateToken,
  generateMessage,
};
