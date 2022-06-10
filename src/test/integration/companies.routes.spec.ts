import {
  generateAdministrator,
  generateAdvert,
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
    expect(response.body).not.toHaveProperty("passwordHash");
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

  it("Return: Companies as JSON response | Status code: 200", async () => {
    const response = await supertest(app)
      .get("/companies")
      .set("Authorization", "Bearer " + tokenAdm);
    const { passwordHash, adverts, comparePwd, ...company } = newCompany;
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

  it("Return: Companies as JSON response page 2 | Status code: 200", async () => {
    const response = await supertest(app)
      .get("/companies?page=2")
      .set("Authorization", "Bearer " + tokenAdm);
    const { passwordHash, adverts, comparePwd, ...company } = newCompany;
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  it("Return: Companies as JSON response perPage 4 | Status code: 200", async () => {
    const response = await supertest(app)
      .get("/companies?page=2")
      .set("Authorization", "Bearer " + tokenAdm);
    const { passwordHash, adverts, comparePwd, ...company } = newCompany;
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(4);
  });

  it("Return: Companies as JSON response page 2 perPage 4 | Status code: 200", async () => {
    const response = await supertest(app)
      .get("/companies?page=2")
      .set("Authorization", "Bearer " + tokenAdm);
    const { passwordHash, adverts, comparePwd, ...company } = newCompany;
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

describe("Get company route | Integration Test", () => {
  let connection: DataSource;

  let tokenCompany: string;
  let tokenAdm: string;
  let tokenOtherCompany: string;
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

    //insert 2 companies
    const companyRepo = connection.getRepository(Company);
    newCompany = Object.assign(new Company(), () => {
      const { password, ...newPayload } = generateCompany();
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    });
    newCompany = await administratorRepo.save(newCompany);
    tokenCompany = generateToken(newCompany.id as string);
    let newCompanyTwo = Object.assign(new Company(), () => {
      const { password, ...newPayload } = generateCompany();
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    });
    newCompanyTwo = await administratorRepo.save(newCompanyTwo);
    tokenOtherCompany = generateToken(newCompanyTwo.id as string);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: Company as JSON response | Status code: 200", async () => {
    const response = await supertest(app)
      .get(`/companies/${newCompany.id}`)
      .set("Authorization", "Bearer " + tokenCompany);
    const { passwordHash, adverts, comparePwd, ...company } = newCompany;
    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty("passwordHash");
    expect(response.body).toEqual(
      expect.objectContaining({
        ...company,
        adverts: `/adverts/byCompany/${company.id}`,
      })
    );
  });

  it("Return: Company as JSON response | Status code: 200", async () => {
    const response = await supertest(app)
      .get(`/companies/${newCompany.id}`)
      .set("Authorization", "Bearer " + tokenAdm);
    const { passwordHash, adverts, comparePwd, ...company } = newCompany;
    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty("passwordHash");
    expect(response.body).toEqual(
      expect.objectContaining({
        ...company,
        adverts: `/adverts/byCompany/${company.id}`,
      })
    );
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app).get(`/companies/${newCompany.id}`);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token",
    });
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .get(`/companies/${newCompany.id}`)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const response = await supertest(app)
      .get(`/companies/${newCompany.id}`)
      .set("Authorization", "Bearer " + tokenOtherCompany);

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      Error: "You can't access information of another company",
    });
  });

  it("Return: Body error, not Found | Status code: 404", async () => {
    const response = await supertest(app)
      .get(`/companies/${"idNotExistent"}`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Message: "Company not found",
    });
  });
});

describe("Update company route | Integration Test", () => {
  let connection: DataSource;

  let tokenAdm: string;
  let tokenCompany: string;
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
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: User as JSON response | Status code: 204", async () => {
    const newInformation = generateCompany();

    const response = await supertest(app)
      .patch(`/companies/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...newInformation });

    const { password, ...newCompany } = newInformation;

    const companyRepo = connection.getRepository(Company);
    const updatedCompany = await companyRepo.findOneBy({ id: company.id });

    expect(response.status).toBe(204);
    expect(updatedCompany).toEqual(expect.objectContaining({ ...newCompany }));
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app)
      .patch(`/companies/${company.id}`)
      .send({ ...generateCompany() });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });

  it("Return: Body error, invalid information | Status code: 400", async () => {
    const newInformation = { email: "teste", cnpj: "1263" };

    const response = await supertest(app)
      .patch(`/companies/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...newInformation });

    expect(response.status).toBe(400);
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .patch(`/companies/${company.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ ...generateCompany() });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const response = await supertest(app)
      .patch(`/companies/${otherCompany.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...generateCompany() });

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      Error: "You can't access information of another company",
    });
  });

  it("Return: Body error, company not Found | Status code: 404", async () => {
    const response = await supertest(app)
      .patch(`/companies/${adm.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...generateCompany() });

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      Message: "Company not found",
    });
  });

  it("Return: Body error, updating duplicate email | Status code: 409", async () => {
    const newInformation = { ...generateCompany(), email: otherCompany.email };

    const response = await supertest(app)
      .patch(`/users/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...newInformation });

    expect(response.status).toBe(409);
    expect(response.body).toStrictEqual({
      message: "User already exists",
    });
  });

  it("Return: Body error, updating duplicate cnpj | Status code: 409", async () => {
    const newInformation = { ...generateCompany(), email: otherCompany.cnpj };

    const response = await supertest(app)
      .patch(`/users/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...newInformation });

    expect(response.status).toBe(409);
    expect(response.body).toStrictEqual({
      message: "User already exists",
    });
  });

  it("Return: Body error, updating duplicate username | Status code: 409", async () => {
    const newInformation = {
      ...generateCompany(),
      email: otherCompany.username,
    };

    const response = await supertest(app)
      .patch(`/users/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...newInformation });

    expect(response.status).toBe(409);
    expect(response.body).toStrictEqual({
      message: "User already exists",
    });
  });
});
