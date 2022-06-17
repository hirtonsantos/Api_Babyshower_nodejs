import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";
import { AppError } from "../../errors/appError";

const chatArchiveService = async (dataArchive: any, chat_id: string, userId: any) => {
  const chatRepository = AppDataSource.getRepository(Chat);

  if (Object.keys(dataArchive).length > 0){
    throw new AppError(400, { Error: "Body error, missing some mandatory-key" });
  }

  const chat = await chatRepository
    .findOneBy({
      id: chat_id,
    })
  
  if (!chat){
    throw new AppError(404, { Message: "Chat not found" });
  }

  if (
    chat.parent_user != userId ||
    chat.parent_user != userId
  ) {
    throw new AppError(403, {
      Error: "You can't access information of another user",
    });
  }

  await chatRepository.update(chat?.id!, { archived: true });

  return chat;
};

export default chatArchiveService;
