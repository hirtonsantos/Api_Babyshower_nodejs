import { generateCompany } from "..";
import { Companie } from "../../entities/companies.entity";
import supertest from "supertest";
import app from "../../app";
import { validate } from "uuid";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";

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

  const company: Partial<Companie> = generateCompany();

  it("Return: User as JSON reponse | Status code 201", async () => {
    const response = await supertest(app)
      .post("/companies")
      .send({ ...company });

    const { passwordHash, ...newCompany } = company;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(response.body).toHaveProperty(["phone"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({ ...newCompany }));
  });

  it("Return: Body error, missing password | Status code: 422", async () => {
    const { passwordHash, ...newCompany } = company;

    const response = await supertest(app)
      .post("/companies")
      .send({ ...newCompany });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: ["password is a required field"],
    });
  });

  it("Return: Body error, user already exists | Status code: 409", async () => {
    const response = await supertest(app)
      .post("/companies")
      .send({ ...company });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      Error: "Key cnpj or email or username already exists",
    });
  });
});

/* describe("Login company route | Integration Test", () => {}); */
