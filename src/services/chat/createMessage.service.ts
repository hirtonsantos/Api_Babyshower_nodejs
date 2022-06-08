import { AppDataSource } from "../../data-source";
import { Chat } from "../../entities/chat.entity";
import { Message } from "../../entities/messages.entity";

const createMessageService = async (
  data: any,
  other_parent_id: string,
  user_id: string
) => {

  const chatRepository = AppDataSource.getRepository(Chat);
  const messageRepository = AppDataSource.getRepository(Message)

  const chat_list = await chatRepository.find();

  const chatAlreadyExist = chat_list.find(
    (item) =>
      item.parent_id_main === user_id &&
      item.parent_id_retrieve === other_parent_id
  );

  // create first chat

  let chat;

  if (!chatAlreadyExist) {
    chat = new Chat();
    chat.parent_id_main = user_id;
    chat.parent_id_retrieve = other_parent_id;

    // chatRepository.create(chat);
    // await chatRepository.save(chat);
  }

  console.log(chat)

  // create message
  const message = new Message();
  message.message = data.message
  message.chat_id = chat?.id!
  message.parent_id = user_id

  console.log(message)
//   messageRepository.create(message)
//   messageRepository.save(message)


  return {"msg": "Mensagem enviada com sucesso!"}

};

export default createMessageService;
