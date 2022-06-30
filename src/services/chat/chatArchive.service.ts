import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";
import { AppError } from "../../errors/appError";
import { IArchived } from "../../interfaces/chat.interface";

const chatArchiveService = async (
  dataArchive: IArchived,
  chat_id: string,
  userId: any
) => {
  const chatRepository = AppDataSource.getRepository(Chat);

  const chat = await chatRepository.findOneBy({
    id: chat_id,
  });

  if (!chat) {
    throw new AppError(404, { Message: "Chat not found" });
  }

  if (chat.parent_user != userId && chat.other_parent_user != userId) {
    throw new AppError(403, {
      Error: "You can't access information of another user",
    });
  }

  await chatRepository.update(chat?.id!, dataArchive);
};

export default chatArchiveService;
