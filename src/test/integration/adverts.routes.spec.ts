import {
  generateAdministrator,
  generateAdvert,
  generateCompany,
  generateToken,
  IAdministrator,
  IAdvert,
} from "..";
import { Advert } from "../../entities/adverts.entity";
import supertest from "supertest";
import app from "../../app";
import { validate, v4 as uuid } from "uuid";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { hashSync } from "bcrypt";
import { verify } from "jsonwebtoken";
import { Company } from "../../entities/companies.entity";
import { Administrator } from "../../entities/administrators.entity";

describe("Create advert route | Integration Test", () => {
  let connection: DataSource;

  let tokenAdm: string;
  let tokenCompany: string;
  let advert: Partial<IAdvert> = generateAdvert();
  let company: Partial<Company>;
  let otherCompany: Partial<Company>;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    //add admnistrator
    const admRepo = connection.getRepository(Administrator);
    let adm = Object.assign(new Administrator(), () => {
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

  it("Return: Body error, missing password | Status code: 400", async () => {
    const { password, ...newAdvert } = advert;

    const response = await supertest(app)
      .post("/adverts")
      .send({ ...newAdvert });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      errors: ["password is a required field"],
    });
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .get("/adverts")
      .set("Authorization", "Bearer " + token)
      .send({ ...advert });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permission | Status code: 401", async () => {
    const token = generateToken(uuid());

    const response = await supertest(app)
      .get("/adverts")
      .set("Authorization", "Bearer " + token)
      .send({ ...advert });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "You are not allowed to access this information",
    });
  });

  it("Return: Body error, user already exists | Status code: 409", async () => {
    const { password, ...newAdvert } = adm;

    const response = await supertest(app)
      .post("/adverts/")
      .set("Authorization", "Bearer " + tokenAdm)
      .send({ ...adm });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toStrictEqual({
      error: "Key email or username already exists",
    });
  });
});

describe("Login advert route | Integration Test", () => {
  let connection: DataSource;

  let payload = generateAdvert();
  let advert: Advert;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const advertRepo = connection.getRepository(Advert);
    const { password, ...newPayload } = payload;

    advert = Object.assign(new Advert(), {
      ...newPayload,
      passwordHash: hashSync(password as string, 8),
    });
    advert = await advertRepo.save(advert);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: token as JSON response | Status code: 200", async () => {
    const { email, password } = payload;

    const response = await supertest(app)
      .post("/adverts/login")
      .send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("access_token");
    expect(
      verify(response.body.access_token, process.env.SECRET_KEY as string)
    ).toBeTruthy();
  });

  it("Return: token as JSON response | Status code: 200", async () => {
    const { username, password } = payload;

    const response = await supertest(app)
      .post("/adverts/login")
      .send({ username, password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("access_token");
    expect(
      verify(response.body.access_token, process.env.SECRET_KEY as string)
    ).toBeTruthy();
  });

  it("Return: Body error, invalid credentials | Status code: 401", async () => {
    const { email } = payload;

    const response = await supertest(app)
      .post("/adverts/login")
      .send({ email, password: "wrongPassword" });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "User not authorized",
    });
  });

  it("Return: Body error, incomplet keys | Status code: 400", async () => {
    const { email } = payload;

    const response = await supertest(app)
      .post("/adverts/login")
      .send({ email });

    expect(response.status).toBe(400);
  });

  it("Return: Body error, incomplet keys | Status code: 400", async () => {
    const { password } = payload;

    const response = await supertest(app)
      .post("/adverts/login")
      .send({ password });

    expect(response.status).toBe(400);
  });
});
