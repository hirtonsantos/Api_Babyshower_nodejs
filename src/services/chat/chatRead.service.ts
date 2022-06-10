import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";
import { Message } from "../../entities/messages.entity";

const chatReadService = async (chat_id: string, user_id: number) => {
  const chatRepository = AppDataSource.getRepository(Chat);
  const msgRepository = AppDataSource.getRepository(Message);

  const chat = await chatRepository.findOneBy({
    id: chat_id,
  })

  chat?.messages.map(async (msg) => {
    if (msg.parent_id !== user_id && chat.other_parent_user === user_id) {
      const msg_item = await msgRepository.findOneBy({
        id: msg.id,
      })
      msgRepository.update(msg_item!.id, {read_message: true});
    }
    return true
  });

  return {
    messages: chat?.messages
  }
};

export default chatReadService;
