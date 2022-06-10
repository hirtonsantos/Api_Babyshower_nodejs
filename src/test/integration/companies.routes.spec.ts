import { generateCompany, generateToken, ICompany } from "..";
import { Company } from "../../entities/companies.entity";
import supertest from "supertest";
import app from "../../app";
import { validate } from "uuid";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { hashSync } from "bcrypt";
import { verify } from "jsonwebtoken";

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
    const { password, ...newCompany } = company;

    const response = await supertest(app)
      .post("/companies")
      .send({ ...company });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(response.body).toHaveProperty(["phone"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({ ...newCompany }));
  });

  it("Return: Body error, missing password | Status code: 400", async () => {
    const { password, ...newCompany } = company;

    const response = await supertest(app)
      .post("/companies/")
      .send({ ...newCompany });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body).toStrictEqual({
      errors: ["password is a required field"],
    });
  });

  it("Return: Body error, user already exists | Status code: 409", async () => {
    const response = await supertest(app)
      .post("/companies/")
      .send({ ...company });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toStrictEqual({
      error: "Key cnpj or email or username already exists",
    });
  });
});

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
    const { password, ...newPayload } = payload;

    company = Object.assign(new Company(), {
      ...newPayload,
      passwordHash: hashSync(password as string, 8),
    });
    company = await companyRepo.save(company);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: token as JSON response | Status code: 200", async () => {
    const { email, password } = payload;

    const response = await supertest(app)
      .post("/companies/login")
      .send({ email, password });

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
    expect(
      verify(response.body.access_token, process.env.SECRET_KEY as string)
    ).toBeTruthy();
  });

  it("Return: Body error, invalid credentials | Status code: 401", async () => {
    const { email } = payload;

    const response = await supertest(app)
      .post("/companies/login")
      .send({ email, password: "wrongPassword" });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "User not authorized",
    });
  });

  it("Return: Body error, incomplet keys | Status code: 400", async () => {
    const { email } = payload;

    const response = await supertest(app)
      .post("/companies/login")
      .send({ email });

    expect(response.status).toBe(400);
  });
});

/* describe("Get companies route | Integration Test", () => {
  let connection: DataSource;

  let companies: Companie[];

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const companyRepo = connection.getRepository(Companie);

    for (let i = 1; i < 10; i++) {
      const { password, ...newPayload } = generateCompany();

      companies.push(
        await companyRepo.save({
          ...newPayload,
          passwordHash: hashSync(password as string, 8),
        })
      );
    }
  });

  afterAll(async () => {
    await connection.destroy();
  });

  //OS TESTES COMENTADOS SÓ SERÃO CONCLUÍDOS APÓS ENTITY ADMINISTRATOR ESTAR CONCLÚIDA

  it("Return: Users as JSON response | Status code: 200", async () => {});

  it("Return: Users as JSON response page 2 | Status code: 200", async () => {});

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app).get("/companies");
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token",
    });
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .get("/companies")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permision | Status code: 401", async () => {
    const token = generateToken(company.id);

    const response = await supertest(app)
      .get("/companies")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "You are not allowed to access this information",
    });
  });
}); */
