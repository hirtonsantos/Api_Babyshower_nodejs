import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";
import { AppError } from "../../errors/appError";

const chatArchiveService = async (chat_id: string) => {
  const chatRepository = AppDataSource.getRepository(Chat);

  const chat = await chatRepository.findOneBy({
    id: chat_id,
  }).catch((_) => {
    throw new AppError(404, "Chat not found")
  })

  await chatRepository.update(chat?.id!, { archived: true });

  return chat;
};

export default chatArchiveService;
