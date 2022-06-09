import { generateCompany, ICompany } from "..";
import { Company } from "../../entities/companies.entity";
import supertest from "supertest";
import app from "../../app";
import { validate } from "uuid";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { hashSync } from "bcrypt";
import { verify } from "jsonwebtoken";
import { endsWith } from "lodash";

describe("Create company route | Integration Test", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  const company: Partial<ICompany> = generateCompany();

  it("Return: Company as JSON reponse | Status code 201", async () => {
    const { passwordHash, ...newCompany } = company;

    const response = await supertest(app)
      .post("/companies")
      .send({ ...company });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(response.body).toHaveProperty(["phone"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({ ...newCompany }));
  });

  it("Return: Body error, missing password | Status code: 422", async () => {
    const { passwordHash, ...newCompany } = company;

    const response = await supertest(app)
      .post("/companies/")
      .send({ ...newCompany });

    console.log(response.body);

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("errors");
    expect(response.body).toStrictEqual({
      errors: ["passwordHash is a required field"],
    });
  });

  it("Return: Body error, user already exists | Status code: 409", async () => {
    const response = await supertest(app)
      .post("/companies/")
      .send({ ...company });

    console.log(response.body);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toStrictEqual({
      error: "Key cnpj or email or username already exists",
    });
  });
});

// ! Commenting to isolate the error

/*

describe("Login company route | Integration Test", () => {
  let connection: DataSource;

  let payload = generateCompany();
  let company: Company;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const companyRepo = connection.getRepository(Company);
    const { passwordHash, ...newPayload } = payload;

    company = await companyRepo.save({
      ...newPayload,
      passwordHash: hashSync(passwordHash as string, 8),
    });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: token as JSON response | Status code: 200", async () => {
    const { email, passwordHash } = payload;

    const response = await supertest(app)
      .post("/companies/login")
      .send({ email, passwordHash });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
    expect(
      verify(response.body.access_token, process.env.SECRET_KEY as string)
    ).toBeTruthy();
  });

  it("Return: Body error, invalid credentials | Status code: 401", async () => {
    const { email } = payload;

    const response = await supertest(app)
      .post("/login")
      .send({ email, password: "wrongPassword" });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "User not authorized",
    });
  });
});
*/
