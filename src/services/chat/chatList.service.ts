import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";

const chatListService = async (user_id: string) => {
  const chatRepository = AppDataSource.getRepository(Chat);

  const chat = await chatRepository.find({
    where: [{ parent_user: user_id }, { other_parent_user: user_id }],
  });

  const chatArchive = chat.find((item) => item.archived === true);

  if (chatArchive) {
    return { error: "Sem chat disponível, inicie uma conversa" };
  }

  return chat;
};

export default chatListService;
