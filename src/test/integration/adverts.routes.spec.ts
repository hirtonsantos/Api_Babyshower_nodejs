import {
  generateAdministrator,
  generateAdvert,
  generateCompany,
  generateToken,
  IAdvert,
} from "..";
import { Advert } from "../../entities/adverts.entity";
import supertest from "supertest";
import app from "../../app";
import { validate, v4 as uuid } from "uuid";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Company } from "../../entities/companies.entity";
import { Administrator } from "../../entities/administrators.entity";

describe("Create advert route | Integration Test", () => {
  let connection: DataSource;

  let tokenAdm: string;
  let tokenCompany: string;
  let advert: Partial<IAdvert> = generateAdvert();
  let adm: Administrator;
  let company: Company;
  let otherCompany: Company;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    //add admnistrator
    const admRepo = connection.getRepository(Administrator);
    adm = Object.assign(new Administrator(), () => {
      const { password, ...newPayload } = generateAdministrator();
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    });
    adm = await admRepo.save(adm);
    tokenAdm = generateToken(adm.id as string);

    //add company
    const companyRepo = connection.getRepository(Company);
    company = Object.assign(new Company(), () => {
      const { password, ...newPayload } = generateCompany();
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    });
    company = await companyRepo.save(company);
    tokenCompany = generateToken(company.id as string);

    //add other company
    otherCompany = Object.assign(new Company(), () => {
      const { password, ...newPayload } = generateCompany();
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    });
    otherCompany = await companyRepo.save(otherCompany);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: Advert as JSON response | Status code 201", async () => {
    const response = await supertest(app)
      .post(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...advert });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({ ...advert }));
  });

  it("Return: Advert as JSON response image and linkAdverts as undefined | Status code 201", async () => {
    const { image, linkAdverts, ...newAdvert } = advert;

    const response = await supertest(app)
      .post(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...newAdvert });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(response.body).toHaveProperty(["image"]);
    expect(response.body).toHaveProperty(["linkAdverts"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({ ...newAdvert }));
  });

  it("Return: Advert as JSON response token ADM | Status code 201", async () => {
    const response = await supertest(app)
      .post(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + tokenAdm)
      .send({ ...advert });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({ ...advert }));
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app)
      .post(`/adverts/byCompany/${company.id}`)
      .send({ ...advert });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token",
    });
  });

  it("Return: Body error, missing some mandatory-key | Status code: 400", async () => {
    const { title, description, ...newAdvert } = advert;

    const response = await supertest(app)
      .post(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...newAdvert });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      errors: ["password is a required field"],
    });
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .post(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ ...advert });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permission | Status code: 403", async () => {
    const response = await supertest(app)
      .post(`/adverts/byCompany/${otherCompany.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...advert });

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      Error: "You are not allowed to access this information",
    });
  });

  it("Return: Body error, company not found | Status code: 404", async () => {
    const response = await supertest(app)
      .post(`/adverts/byCompany/${adm.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...advert });

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      Message: "Company not found",
    });
  });
});
