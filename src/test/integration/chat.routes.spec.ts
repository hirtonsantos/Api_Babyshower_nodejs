import supertest from "supertest";
import app from "../../app";
import { validate, v4 as uuid } from "uuid";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { generateMessage, generateToken } from "..";
import { Chat } from "../../entities/chat.entity";

/* describe("Create message for another parent | Integration Test", () => {
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

  it("Return: Message as JSON response | Status code 201", async () => {
    const token = generateToken(1);

    const response = await supertest(app)
      .post(`/chat/2`)
      .set("Authorization", "Bearer " + token)
      .send({ ...generateMessage() });

    const chatRepo = connection.getRepository(Chat);
    const chat = await chatRepo.findOne({
      where: [
        { parent_user: 1, other_parent_user: 2 },
        { parent_user: 2, other_parent_user: 1 },
      ],
    });

    const messageData = {
      msgSucess: "Message sent successfully!",
      message: "Olá tudo bem? Eu vi seu anúncio no site.",
      readMessage: false,
      parentId: 1,
      chat: `/chat/${chat?.id}`,
    };

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toHaveProperty(["createdAt"]);
    expect(response.body).toEqual(expect.objectContaining({ ...messageData }));
    expect(chat).toBeTruthy();
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const token = generateToken(1);

    const response = await supertest(app)
      .post(`/chat/2`)
      .send({ ...generateMessage() });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token",
    });
  });

  it("Return: Body error, missing some mandatory-key | Status code: 400", async () => {
    const token = generateToken(1);

    const response = await supertest(app)
      .post(`/chat/2`)
      .set("Authorization", "Bearer " + token)
      .send({ teste: "teste" });

    expect(response.status).toBe(400);
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .post(`/chat/2`)
      .set("Authorization", "Bearer " + token)
      .send({ ...generateMessage() });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });
}); */
