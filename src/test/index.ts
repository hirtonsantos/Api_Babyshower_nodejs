import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { Company } from "../entities/companies.entity";

const generateCompany = (): Partial<Company> => {
  const razaoSocial = faker.company.companyName().toUpperCase();
  const username = faker.internet.userName(razaoSocial).toLowerCase();
  const email = faker.internet.email(razaoSocial).toLocaleLowerCase();
  const passwordHash = faker.random.alphaNumeric(8);
  const cnpj = faker.random.numeric(14);

  return { razaoSocial, username, email, passwordHash, cnpj };
};

const generateAdvert = () => {};

const generateToken = () => {};

const generateAdministrator = () => {};

const generateMessage = () => {};

export {
  generateCompany,
  generateAdvert,
  generateAdministrator,
  generateToken,
  generateMessage,
};
