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

  chat = new Chat();
  chat.parent_id_main = user_id;
  chat.created_at = "28/08/1989"
  chat.updated_at = "28/08/1989"
  chat.parent_id_retrieve = other_parent_id; 
  chatRepository.create(chat);
  await chatRepository.save(chat);

  const message = new Message();
  message.message = data.message
  message.parent_id = user_id

  messageRepository.create(message)
  
  await messageRepository.save(message)

  chat.messages = [message]

  console.log(chat.messages)

  await chatRepository.save(chat);

  console.log(chat.messages)

  return {"msg": "Mensagem enviada com sucesso!"}

};

export default createMessageService;
