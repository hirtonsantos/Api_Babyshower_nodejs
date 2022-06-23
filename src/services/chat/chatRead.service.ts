import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";
import { Message } from "../../entities/messages.entity";
import { AppError } from "../../errors/appError";

const chatReadService = async (chat_id: string, user_id: number) => {
  const chatRepository = AppDataSource.getRepository(Chat);
  const msgRepository = AppDataSource.getRepository(Message);

  let chat = await chatRepository.find({
    where: {
      id: chat_id,
    },
  });

  if (!chat) {
    throw new AppError(404, { message: "Chat not found" });
  }

  const chatCurrent = chat[0];

  chatCurrent?.messages.map(async (msg) => {
    if (
      msg.parent_id !== user_id &&
      chatCurrent.other_parent_user === user_id
    ) {
      const msg_item = await msgRepository.findOneBy({
        id: msg.id,
      });
      msgRepository.update(msg_item!.id, { read_message: true });
    }
    return true;
  });

  if (
    chatCurrent.parent_user != user_id ||
    chatCurrent.parent_user != user_id
  ) {
    throw new AppError(403, {
      Error: "You can't access information of another user",
    });
  }

  return {
    messages: chatCurrent.messages,
  };
};

export default chatReadService;
