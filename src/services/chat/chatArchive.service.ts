import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";

const chatArchiveService = async (chat_id: string) => {
  const chatRepository = AppDataSource.getRepository(Chat);

  const chat = await chatRepository.findOneBy({
    id: chat_id,
  });

  await chatRepository.update(chat?.id!, { archived: true });

  return chat;
};

export default chatArchiveService;
