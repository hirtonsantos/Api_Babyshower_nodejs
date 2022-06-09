import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";

const chatArchiveService = async (id: string, other_parent_id: string) => {
  const chatRepository = AppDataSource.getRepository(Chat);

  const chat = await chatRepository.findOneBy({
    parent_user: id,
    other_parent_user: other_parent_id,
  })

  await chatRepository.update(chat?.id!, {archived:true})

  return chat;
};

export default chatArchiveService;
