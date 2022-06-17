import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";

const chatListService = async (user_id: number, page: number, perPage: number) => {
  const chatRepository = AppDataSource.getRepository(Chat);

  const chat = await chatRepository.find({
    where: [{ parent_user: user_id }, { other_parent_user: user_id }],
  });

  const chatArchive = chat.find((item) => item.archived === true);

  if (chatArchive) {
    return { error: "Sem chat disponível, inicie uma conversa" };
  }

  if (page * perPage > chat.length && page !== 1 && perPage !== 8) {
    return {
      messages: chat,
    };
  }

  let chatList = [];
  const from = (page - 1) * perPage;
  const to = from + perPage;
  for (let i = from; i < to; i++) {
    chatList.push(chat[i]);
  }

  return {
    chats: chatList
  }
  
};

export default chatListService;
