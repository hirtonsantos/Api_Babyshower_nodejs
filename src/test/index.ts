import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { Administrator } from "../entities/administrators.entity";
import { Company } from "../entities/companies.entity";

export interface ICompany extends Partial<Company> {
  password: string;
}

export interface IAdministrator extends Partial<Administrator> {
  password: string;
}

//Aqui é o payload, como o dado entra no request antes do schema
const generateCompany = (): Partial<ICompany> => {
  const razaoSocial = faker.company.companyName().toUpperCase();
  const username = faker.internet.userName(razaoSocial).toLowerCase();
  const email = faker.internet.email(razaoSocial).toLocaleLowerCase();
  const password = faker.random.numeric(8);
  const cnpj = faker.random.numeric(14);

  return { razaoSocial, username, email, password, cnpj };
};

//Aqui é o payload, como o dado entra no request antes do schema
const generateAdvert = () => {};

//Aqui é o payload, como o dado entra no request antes do schema
const generateAdministrator = () => {
  const username = faker.internet.userName().toLowerCase();
  const email = faker.internet.email(username).toLocaleLowerCase();
  const password = faker.random.numeric(8);

  return { username, email, password };
};

//Aqui é o payload, como o dado entra no request antes do schema
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
