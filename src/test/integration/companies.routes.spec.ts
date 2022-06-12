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

/* describe("Get companies route | Integration Test", () => {
  let connection: DataSource;

  let companies: Company[] = [];
  let tokenCompany: string;
  let tokenAdm: string;
  let newCompany: Company;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const newInstance = (generate: ICompany | IAdministrator): any => {
      const { password, ...newPayload } = generate;
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    };

    //add admnistrator
    const admRepo = connection.getRepository(Administrator);
    let adm = Object.assign(
      new Administrator(),
      newInstance(generateAdministrator())
    );
    adm = await admRepo.save(adm);
    tokenAdm = generateToken(adm.id as string);

    //insert logged company
    const companyRepo = connection.getRepository(Company);
    newCompany = Object.assign(new Company(), newInstance(generateCompany()));
    newCompany = await companyRepo.save(newCompany);
    tokenCompany = generateToken(newCompany.id as string);

    //insert 9 others companies
    for (let i = 1; i <= 9; i++) {
      const companyRepo = connection.getRepository(Company);
      let newCompany: Company = Object.assign(
        new Company(),
        newInstance(generateCompany())
      );
      newCompany = await companyRepo.save(newCompany);
      companies.push(newCompany);
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
      .get("/companies?perPage=4")
      .set("Authorization", "Bearer " + tokenAdm);
    const { passwordHash, adverts, comparePwd, ...company } = newCompany;
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(4);
  });

  it("Return: Companies as JSON response page 3 perPage 4 | Status code: 200", async () => {
    const response = await supertest(app)
      .get("/companies?page=2&perPage=4")
      .set("Authorization", "Bearer " + tokenAdm);
    const { passwordHash, adverts, comparePwd, ...company } = newCompany;
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
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
}); */

/* describe("Get company route | Integration Test", () => {
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

    const newInstance = (generate: ICompany | IAdministrator): any => {
      const { password, ...newPayload } = generate;
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    };

    //add admnistrator
    const admRepo = connection.getRepository(Administrator);
    let adm: Administrator = Object.assign(
      new Administrator(),
      newInstance(generateAdministrator())
    );
    adm = await admRepo.save(adm);
    tokenAdm = generateToken(adm.id as string);

    //insert logged company
    const companyRepo = connection.getRepository(Company);
    newCompany = Object.assign(new Company(), newInstance(generateCompany()));
    newCompany = await companyRepo.save(newCompany);
    tokenCompany = generateToken(newCompany.id as string);

    //insert other company
    let newOtherCompany = Object.assign(
      new Company(),
      newInstance(generateCompany())
    );
    newOtherCompany = await companyRepo.save(newOtherCompany);
    tokenOtherCompany = generateToken(newCompany.id as string);
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
}); */

/* describe("Update company route | Integration Test", () => {
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

    const newInstance = (generate: ICompany | IAdministrator): any => {
      const { password, ...newPayload } = generate;
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    };

    //add admnistrator
    const admRepo = connection.getRepository(Administrator);
    adm = Object.assign(
      new Administrator(),
      newInstance(generateAdministrator())
    );
    adm = await admRepo.save(adm);
    tokenAdm = generateToken(adm.id as string);

    //add company
    const companyRepo = connection.getRepository(Company);
    company = Object.assign(new Company(), newInstance(generateCompany()));
    company = await companyRepo.save(company);
    tokenCompany = generateToken(company.id as string);

    //add other company
    otherCompany = Object.assign(new Company(), newInstance(generateCompany()));
    otherCompany = await companyRepo.save(otherCompany);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: No body response | Status code: 204", async () => {
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

  it("Return: No body response updating by ADM | Status code: 204", async () => {
    const newInformation = generateCompany();

    const response = await supertest(app)
      .patch(`/companies/${company.id}`)
      .set("Authorization", "Bearer " + tokenAdm)
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
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token.",
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
      Error: "Key cnpj or email or username already exists",
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
      Error: "Key cnpj or email or username already exists",
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
      Error: "Key cnpj or email or username already exists",
    });
  });
}); */

/* describe("Delete company route | Integration Test", () => {
  let connection: DataSource;

  let tokenAdm: string;
  let tokenCompany: string;
  let adm: Administrator;
  let company: Company;
  let otherCompany: Company;

  beforeEach(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const newInstance = (generate: ICompany | IAdministrator): any => {
      const { password, ...newPayload } = generate;
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    };

    //add admnistrator
    const admRepo = connection.getRepository(Administrator);
    adm = Object.assign(
      new Administrator(),
      newInstance(generateAdministrator())
    );
    adm = await admRepo.save(adm);
    tokenAdm = generateToken(adm.id as string);

    //add company
    const companyRepo = connection.getRepository(Company);
    company = Object.assign(new Company(), newInstance(generateCompany()));
    company = await companyRepo.save(company);
    tokenCompany = generateToken(company.id as string);

    //add other company
    otherCompany = Object.assign(new Company(), newInstance(generateCompany()));
    otherCompany = await companyRepo.save(otherCompany);
  });

  afterEach(async () => {
    await connection.destroy();
  });

  it("Return: no body response | Status code: 204", async () => {
    const response = await supertest(app)
      .delete(`/companies/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany);

    const companyRepo = connection.getRepository(Company);
    const deletedCompany = await companyRepo.findOneBy({ id: company.id });

    expect(response.status).toBe(204);
    expect(deletedCompany).toBeFalsy;
  });

  it("Return: no body response deleting by ADM | Status code: 204", async () => {
    const response = await supertest(app)
      .delete(`/companies/${company.id}`)
      .set("Authorization", "Bearer " + tokenAdm);

    const companyRepo = connection.getRepository(Company);
    const deletedCompany = await companyRepo.findOneBy({ id: company.id });

    expect(response.status).toBe(204);
    expect(deletedCompany).toBeFalsy;
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app).delete(`/companies/${company.id}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token.",
    });
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .delete(`/companies/${company.id}`)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const response = await supertest(app)
      .delete(`/companies/${otherCompany.id}`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      Error: "You can't access information of another company",
    });
  });

  it("Return: Body error, company not Found | Status code: 404", async () => {
    const response = await supertest(app)
      .delete(`/companies/${adm.id}`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      Message: "Company not found",
    });
  });
}); */
