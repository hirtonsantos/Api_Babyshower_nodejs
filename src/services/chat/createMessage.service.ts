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
      item.parent_user === user_id &&
      item.other_parent_user === other_parent_id
  );

  // create first chat

  let chat;

  if (!chatAlreadyExist){
    chat = new Chat();
    chat.parent_user = user_id;
    chat.created_at = new Date().toUTCString()
    chat.updated_at = chat.created_at
    chat.other_parent_user = other_parent_id; 
    chat.messages = []
    chatRepository.create(chat);
    await chatRepository.save(chat);
  } else {
    chat = chatAlreadyExist
    chat.updated_at = new Date().toUTCString()
  }


  const message = new Message();
  message.message = data.message
  message.parent_id = user_id

  messageRepository.create(message)
  await messageRepository.save(message)

  chat.messages.push(message)

  await chatRepository.save(chat);

  return {"msg": "Mensagem enviada com sucesso!"}

};

export default createMessageService;
