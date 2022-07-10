import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";
import { Message } from "../../entities/messages.entity";
import { AppError } from "../../errors/appError";

const chatReadService = async (chat_id: string, user_id: any) => {
  const chatRepository = AppDataSource.getRepository(Chat);
  const msgRepository = AppDataSource.getRepository(Message);

  let chat = await chatRepository.findOneBy({
    id: chat_id,
  });

  if (!chat) {
    throw new AppError(404, { Message: "Chat not found" });
  }

  if (chat.parent_user != user_id && chat.other_parent_user != user_id) {
    throw new AppError(403, {
      Error: "You can't access information of another user",
    });
  }

  chat?.messages.map(async (msg) => {
    if (msg.parent_id !== user_id && !msg.read_message) {
      msg.read_message = true;
      await msgRepository.update(msg.id, { read_message: true });
    }
  });

  return {
    messages: chat.messages,
  };
};

export default chatReadService;
