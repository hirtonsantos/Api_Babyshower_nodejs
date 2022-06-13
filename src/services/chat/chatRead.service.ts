import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";
import { Message } from "../../entities/messages.entity";
import { AppError } from "../../errors/appError";

const chatReadService = async (
  chat_id: string,
  user_id: number,
  page: number,
  perPage: number
) => {
  const chatRepository = AppDataSource.getRepository(Chat);
  const msgRepository = AppDataSource.getRepository(Message);

  let chat = await chatRepository
    .find({
      where: {
        id: chat_id,
      },
    })
    .catch((_) => {
      throw new AppError(404, { message: "Chat not found" });
    });

  const chatCurrent = chat[0];

  chatCurrent?.messages.map(async (msg) => {
    if (
      msg.parent_id !== user_id &&
      chatCurrent.other_parent_user === user_id
    ) {
      const msg_item = await msgRepository.findOneBy({
        id: msg.id,
      });
      msgRepository.update(msg_item!.id, { read_message: true });
    }
    return true;
  });

  if (page * perPage > chatCurrent.messages.length) {
    return {
      messages: chatCurrent.messages,
    };
  }

  let messagesChat = [];
  const from = (page - 1) * perPage;
  const to = from + perPage;
  for (let i = from; i < to; i++) {
    messagesChat.push(chatCurrent.messages[i]);
  }

  return {
    messages: messagesChat,
  };
};

export default chatReadService;