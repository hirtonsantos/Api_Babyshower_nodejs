import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";

const chatReadService = async (id: string, other_parent_id: string) => {
  const chatRepository = AppDataSource.getRepository(Chat);

  const chat = await chatRepository.findOneBy({
    parent_user: id,
    other_parent_user: other_parent_id,
  })

  chat?.messages.filter(msg => {
    if(msg.parent_id === other_parent_id){
      msg.read_message = true
    }
  })

  chatRepository.save(chat!)

  return chat;
};

export default chatReadService;