import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";
import { Message } from "../../entities/messages.entity";

const createMessageService = async (
  data: any,
  other_parent_id: number,
  user_id: number
) => {
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
  // message.createdAt = new Date().toUTCString();
  message.message = data.message;
  message.parent_id = user_id;
  message.chat = chat;

  messageRepository.create(message);
  await messageRepository.save(message);

  chat.messages.push(message);

  await chatRepository.save(chat);

  const { createdAt, ...messageCreated } = message

  return {
    msgSucess: "Mensagem enviada com sucesso!",
    createdAt: message.createdAt.toUTCString(),
    ...messageCreated,
    chat: `/chat/${message.chat.id}`,
  };
};

export default createMessageService;
