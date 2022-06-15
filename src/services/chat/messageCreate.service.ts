import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";
import { Message } from "../../entities/messages.entity";
import { AppError } from "../../errors/appError";

const createMessageService = async (
  data: any,
  other_parent_id: number,
  user_id: number
) => {

  if (!data.message){
    throw new AppError(400, { Error: "Body error, missing some mandatory-key" });
  }

  const chatRepository = AppDataSource.getRepository(Chat);
  const messageRepository = AppDataSource.getRepository(Message);

  const chat_list = await chatRepository.find();

  const chatAlreadyExist = chat_list.find((item) => {
    if (
      (item.parent_user === user_id &&
        item.other_parent_user === other_parent_id) ||
      (item.parent_user === other_parent_id &&
        item.other_parent_user === user_id)
    ) {
      return item;
    }
  });

  let chat;

  if (!chatAlreadyExist) {
    chat = new Chat();
    chat.parent_user = user_id;
    chat.other_parent_user = other_parent_id;
    chat.messages = [];
    chatRepository.create(chat);
    await chatRepository.save(chat);
  } else {
    chat = chatAlreadyExist;
  }

  const message = new Message();
  message.message = data.message;
  message.createdAt = new Date();
  message.parent_id = user_id;
  message.chat = chat;

  messageRepository.create(message);
  await messageRepository.save(message);

  chat.messages.push(message);

  await chatRepository.save(chat);

  const { createdAt, ...messageCreated } = message;

  return {
    msgSucess: "Message sent successfully!",
    createdAt: message.createdAt.toUTCString(),
    ...messageCreated,
    chat: `/chat/${message.chat.id}`,
  };
};

export default createMessageService;
