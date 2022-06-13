import { generateAdministrator, generateToken, IAdministrator } from "..";
import { Administrator } from "../../entities/administrators.entity";
import supertest from "supertest";
import app from "../../app";
import { validate, v4 as uuid } from "uuid";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { hashSync } from "bcrypt";
import { verify } from "jsonwebtoken";

/* describe("Create administrator route | Integration Test", () => {
  let connection: DataSource;

  const firstAdministrator: Partial<IAdministrator> = generateAdministrator();
  let tokenFirstAdministrator: string;
  const administrator: Partial<IAdministrator> = generateAdministrator();

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const administratorRepo = connection.getRepository(Administrator);
    const { password, ...newPayload } = firstAdministrator;

    let newFirstAdministrator = Object.assign(new Administrator(), {
      ...newPayload,
      passwordHash: "passwordHash",
    });

    newFirstAdministrator = await administratorRepo.save(newFirstAdministrator);

    tokenFirstAdministrator = generateToken(newFirstAdministrator.id as string);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: Administrator as JSON response | Status code 201", async () => {
    const { password, ...newAdministrator } = administrator;

    const response = await supertest(app)
      .post("/administrators")
      .set("Authorization", "Bearer " + tokenFirstAdministrator)
      .send({ ...administrator });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(
      expect.objectContaining({ ...newAdministrator })
    );
  });

  it("Return: Administrator as JSON response | Status code 201", async () => {
    const { password, ...newAdministrator } = administrator;

    const response = await supertest(app)
      .post("/administrators")
      .set("Authorization", "Bearer " + tokenFirstAdministrator)
      .send({ ...administrator });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(
      expect.objectContaining({ ...newAdministrator })
    );
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app)
      .post("/administrators")
      .send({ ...administrator });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token",
    });
  });

  it("Return: Body error, missing password | Status code: 400", async () => {
    const { password, ...newAdministrator } = administrator;

    const response = await supertest(app)
      .post("/administrators")
      .send({ ...newAdministrator });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      errors: ["password is a required field"],
    });
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .get("/administrators")
      .set("Authorization", "Bearer " + token)
      .send({ ...administrator });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permission | Status code: 401", async () => {
    const token = generateToken(uuid());

    const response = await supertest(app)
      .get("/administrators")
      .set("Authorization", "Bearer " + token)
      .send({ ...administrator });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "You are not allowed to access this information",
    });
  });

  it("Return: Body error, user already exists | Status code: 409", async () => {
    const { password, ...newAdministrator } = firstAdministrator;

    const response = await supertest(app)
      .post("/administrators/")
      .set("Authorization", "Bearer " + tokenFirstAdministrator)
      .send({ ...firstAdministrator });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toStrictEqual({
      error: "Key email or username already exists",
    });
  });
});
*/

describe("Login administrator route | Integration Test", () => {
  let connection: DataSource;

  let payload = generateAdministrator();
  let administrator: Administrator;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const administratorRepo = connection.getRepository(Administrator);
    const { password, ...newPayload } = payload;

    administrator = Object.assign(new Administrator(), {
      ...newPayload,
      passwordHash: hashSync(password as string, 8),
    });
    administrator = await administratorRepo.save(administrator);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: token as JSON response | Status code: 200", async () => {
    const { email, password } = payload;

    const response = await supertest(app)
      .post("/administrators/login")
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
      .post("/administrators/login")
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
      .post("/administrators/login")
      .send({ email, password: "wrongPassword" });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "User not authorized",
    });
  });

  it("Return: Body error, incomplet keys | Status code: 400", async () => {
    const { email } = payload;

    const response = await supertest(app)
      .post("/administrators/login")
      .send({ email });

    expect(response.status).toBe(400);
  });

  it("Return: Body error, incomplet keys | Status code: 400", async () => {
    const { password } = payload;

    const response = await supertest(app)
      .post("/administrators/login")
      .send({ password });

    expect(response.status).toBe(400);
  });
});
