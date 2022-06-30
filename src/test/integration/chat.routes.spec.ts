import supertest from "supertest";
import app from "../../app";
import { validate, v4 as uuid } from "uuid";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { createMessageForData, generateMessage, generateToken } from "..";
import { Chat } from "../../entities/chat.entity";
import { Message } from "../../entities/messages.entity";

describe("Create message for another parent | Integration Test", () => {
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
    const msg = generateMessage();

    const response = await supertest(app)
      .post(`/chat/2`)
      .set("Authorization", "Bearer " + token)
      .send({ ...msg });

    const chatRepo = connection.getRepository(Chat);
    const chat = await chatRepo.findOne({
      where: [
        { parent_user: 1, other_parent_user: 2 },
        { parent_user: 2, other_parent_user: 1 },
      ],
    });

    const messageData = {
      msgSucess: "Message sent successfully!",
      message: msg.message,
      read_message: false,
      parent_id: 1,
      chat: `/chat/${chat?.id}`,
    };

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toHaveProperty(["createdAt"]);
    expect(response.body).toEqual(expect.objectContaining({ ...messageData }));
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
    const msg = generateMessage();

    const response = await supertest(app)
      .post(`/chat/2`)
      .set("Authorization", "Bearer " + token)
      .send({ ...msg });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });
});

describe("Get messages by chatId | Integration Test", () => {
  let connection: DataSource;

  let chatWithParent: Chat;
  let chatWithoutParent: Chat;
  let token: string = generateToken(1);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    //cria um chat que o usuário participa e popula com dez mensagens alternadas
    const chatRepo = connection.getRepository(Chat);
    const messageRepo = connection.getRepository(Message);
    chatWithParent = Object.assign(new Chat(), {
      parent_user: 1,
      other_parent_user: 2,
      messages: [],
    });
    for (let i = 1; i <= 10; i++) {
      let message: Message;
      if (i % 2 === 1) {
        message = Object.assign(new Message(), {
          ...createMessageForData(1),
        });
      } else {
        message = Object.assign(new Message(), {
          ...createMessageForData(2),
        });
      }
      await messageRepo.save(message);
      chatWithParent.messages.push(message);
    }
    chatWithParent = await chatRepo.save(chatWithParent);

    //cria um chat em que ele não participa, só com uma mensagem.
    chatWithoutParent = Object.assign(new Chat(), {
      parent_user: 3,
      other_parent_user: 2,
      messages: [],
    });
    let message: Message;
    message = Object.assign(new Message(), {
      ...createMessageForData(1),
    });
    await messageRepo.save(message);
    chatWithoutParent = await chatRepo.save(chatWithoutParent);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: Messages as JSON response | Status code 200", async () => {
    const response = await supertest(app)
      .get(`/chat/${chatWithParent.id}`)
      .set("Authorization", "Bearer " + token);

    const { chat, createdAt, ...message } = chatWithParent.messages[0];

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(["messages"]);
    expect(response.body.messages).toBeInstanceOf(Array);
    expect(response.body.messages[0]).toEqual(expect.objectContaining(message));
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app).get(`/chat/${chatWithParent.id}`);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token",
    });
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";
    const response = await supertest(app)
      .get(`/chat/${chatWithParent.id}`)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const response = await supertest(app)
      .get(`/chat/${chatWithoutParent.id}`)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      Error: "You can't access information of another user",
    });
  });

  it("Return: Body error, chat not found | Status code: 404", async () => {
    const response = await supertest(app)
      .get(`/chat/idNotExist`)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      Message: "Chat not found",
    });
  });
});

describe("Get chats that parent is included | Integration Test", () => {
  let connection: DataSource;

  let chatsWithParent: Chat[] = [];
  let chatWithoutParent: Chat;
  let token: string = generateToken(1);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    //cria 6 chats que o usuário participa e não estão arquivados e popula com 1 mensagem cada
    const chatRepo = connection.getRepository(Chat);
    const messageRepo = connection.getRepository(Message);
    for (let i = 1; i <= 6; i++) {
      let message = Object.assign(new Message(), {
        ...createMessageForData(1),
      });
      await messageRepo.save(message);
      let chatWithParent = Object.assign(new Chat(), {
        parent_user: 1,
        other_parent_user: i + 1,
        messages: [],
      });
      chatWithParent.messages.push(message);
      chatWithParent = await chatRepo.save(chatWithParent);
      chatsWithParent.push(chatWithParent);
    }

    //cria 4 chats que o usuário participa que estejam arquivados e popula com 1 mensagem
    for (let i = 1; i <= 4; i++) {
      let message = Object.assign(new Message(), {
        ...createMessageForData(1),
      });
      await messageRepo.save(message);
      let chatWithParent = Object.assign(new Chat(), {
        parent_user: 1,
        other_parent_user: i + 1,
        archived: true,
        messages: [],
      });
      chatWithParent.messages.push(message);
      chatWithParent = await chatRepo.save(chatWithParent);
      chatsWithParent.push(chatWithParent);
    }

    //cria um chat em que ele não participa, só com uma mensagem.
    chatWithoutParent = Object.assign(new Chat(), {
      parent_user: 3,
      other_parent_user: 2,
      messages: [],
    });
    let message: Message;
    message = Object.assign(new Message(), {
      ...createMessageForData(1),
    });
    await messageRepo.save(message);
    chatWithoutParent = await chatRepo.save(chatWithoutParent);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: Not archived Chats as JSON response | Status code 200", async () => {
    const response = await supertest(app)
      .get(`/chat`)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(200);
    expect(response.body.chats).toBeInstanceOf(Array);
    expect(response.body.chats).toHaveLength(6);
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app).get(`/chat`);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token",
    });
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .get(`/chat`)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });
});

/* describe("Update chat to archieved", () => {
  let connection: DataSource;

  let chatWithParent: any;
  let chatWithoutParent: Chat;
  let token: string = generateToken(1);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    //cria um chat que o usuário participa com uma mensagem
    const chatRepo = connection.getRepository(Chat);
    const messageRepo = connection.getRepository(Message);

    let messageParent = Object.assign(new Message(), {
      ...createMessageForData(1),
    });
    await messageRepo.save(messageParent);
    chatWithParent = Object.assign(new Chat(), {
      parent_user: 1,
      other_parent_user: 2,
      messages: [],
    });
    chatWithParent.messages.push(messageParent);
    chatWithParent = await chatRepo.save(chatWithParent);

    //cria um chat em que ele não participa com uma mensagem
    chatWithoutParent = Object.assign(new Chat(), {
      parent_user: 3,
      other_parent_user: 2,
      messages: [],
    });
    let message: Message;
    message = Object.assign(new Message(), {
      ...createMessageForData(1),
    });
    await messageRepo.save(message);
    chatWithoutParent = await chatRepo.save(chatWithoutParent);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: No body response | Status code: 204", async () => {
    const response = await supertest(app)
      .patch(`/chat/${chatWithParent.id}`)
      .set("Authorization", "Bearer " + token)
      .send();

    const chatRepo = connection.getRepository(Chat);
    const updatedChat = await chatRepo.findOneBy({ id: chatWithParent.id });

    expect(response.status).toBe(204);
    expect(updatedChat?.archived).toBe(true);
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app)
      .patch(`/chat/${chatWithParent.id}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token",
    });
  });

  it("Return: Body error, invalid information | Status code: 400", async () => {
    const newInformation = { title: 126 };

    const response = await supertest(app)
      .patch(`/chat/${chatWithParent.id}`)
      .set("Authorization", "Bearer " + token)
      .send(newInformation);

    expect(response.status).toBe(400);
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .patch(`/chat/${chatWithParent.id}`)
      .set("Authorization", "Bearer " + token)
      .send();

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const response = await supertest(app)
      .patch(`/chat/${chatWithoutParent.id}`)
      .set("Authorization", "Bearer " + token)
      .send();

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      Error: "You can't access information of another user",
    });
  });

  it("Return: Body error, chat not Found | Status code: 404", async () => {
    const response = await supertest(app)
      .patch(`/chat/idNotExist`)
      .set("Authorization", "Bearer " + token)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      Message: "Chat not found",
    });
  });
}); */
