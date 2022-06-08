import { faker } from "@faker-js/faker";
import { Companie } from "../entities/companies.entity";

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
