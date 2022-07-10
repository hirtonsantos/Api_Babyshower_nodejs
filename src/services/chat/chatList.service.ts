import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";

const chatListService = async (user_id: number, archived: boolean) => {
  const chatRepository = AppDataSource.getRepository(Chat);

  const chat = await chatRepository.find({
    where: [
      { parent_user: user_id, archived },
      { other_parent_user: user_id, archived },
    ],
    cache: true,
  });

  if (!chat) {
    return { error: "Sem chat disponível, inicie uma conversa" };
  }

  return {
    chats: chat,
  };
};

export default chatListService;
