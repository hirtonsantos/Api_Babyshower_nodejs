import {
  generateAdministrator,
  generateCompany,
  generateToken,
  IAdministrator,
  ICompany,
} from "..";
import { Company } from "../../entities/companies.entity";
import supertest from "supertest";
import app from "../../app";
import { validate } from "uuid";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { hashSync } from "bcrypt";
import { verify } from "jsonwebtoken";
import { Administrator } from "../../entities/administrators.entity";

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

describe("Get companies route | Integration Test", () => {
  let connection: DataSource;

  let companies: Company[];
  let tokenCompany: string;
  let tokenAdm: string;
  let newCompany: Company;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    //insert adm
    const administratorRepo = connection.getRepository(Administrator);
    let newAdm = Object.assign(new Administrator(), () => {
      const { password, ...newPayload } = generateAdministrator();
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    });
    newAdm = await administratorRepo.save(newAdm);
    tokenAdm = generateToken(newAdm.id as string);

    //insert logged company
    const companyRepo = connection.getRepository(Company);
    newCompany = Object.assign(new Company(), () => {
      const { password, ...newPayload } = generateCompany();
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    });
    newCompany = await administratorRepo.save(newCompany);
    companies.push(newCompany);
    tokenCompany = generateToken(newCompany.id as string);

    //insert 9 others companies
    for (let i = 1; i < 9; i++) {
      const { password, ...newPayload } = generateCompany();
      companies.push(
        await companyRepo.save(
          Object.assign(new Company(), () => {
            const { password, ...newPayload } = generateCompany();
            return {
              ...newPayload,
              passwordHash: "passwordHash",
            };
          })
        )
      );
    }
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: Users as JSON response | Status code: 200", async () => {
    const response = await supertest(app)
      .get("/companies")
      .set("Authorization", "Bearer " + tokenAdm);
    const { passwordHash, adverts, ...company } = newCompany;
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(8);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        ...company,
        adverts: `/adverts/byCompany/${company.id}`,
      })
    );
  });

  it("Return: Users as JSON response page 2 | Status code: 200", async () => {
    const response = await supertest(app)
      .get("/companies?page=2")
      .set("Authorization", "Bearer " + tokenAdm);
    const { passwordHash, adverts, ...company } = newCompany;
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  it("Return: Users as JSON response perPage 4 | Status code: 200", async () => {
    const response = await supertest(app)
      .get("/companies?page=2")
      .set("Authorization", "Bearer " + tokenAdm);
    const { passwordHash, adverts, ...company } = newCompany;
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(4);
  });

  it("Return: Users as JSON response page 2 perPage 4 | Status code: 200", async () => {
    const response = await supertest(app)
      .get("/companies?page=2")
      .set("Authorization", "Bearer " + tokenAdm);
    const { passwordHash, adverts, ...company } = newCompany;
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(5);
  });

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
    const response = await supertest(app)
      .get("/companies")
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "You are not allowed to access this information",
    });
  });
});
