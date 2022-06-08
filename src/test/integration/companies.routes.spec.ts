import { generateCompany } from "..";
import supertest from "supertest";
import { Company } from "../../entities/companies.entity";
import app from "../../app";
import { validate } from "uuid";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";

describe("Create company route | Integration Test", () => {
  let conncection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (conncection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterAll(async () => {
    await conncection.destroy();
  });

  const company: Partial<Company> = generateCompany();

  it("Return: User as JSON reponse | Status code 201"),
    async () => {
      const response = await supertest(app)
        .post("/companies")
        .send({ ...company });

      const { passwordHash, ...newCompany } = company;

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(["id"]);
      expect(response.body).toHaveProperty(["phone"]);
      expect(validate(response.body.id)).toBeTruthy();
      expect(response.body).toEqual(expect.objectContaining({ ...newCompany }));
    };
});

/* describe("Login company route | Integration Test", () => {}); */
