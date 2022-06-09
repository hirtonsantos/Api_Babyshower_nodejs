import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";

const chatReadService = async (id: string, other_parent_id: string) => {
  const chatRepository = AppDataSource.getRepository(Chat);

  const chat = await chatRepository.findOneBy({
    parent_id_main: id,
    parent_id_retrieve: other_parent_id,
  });

  return chat;
};

export default chatReadService;
