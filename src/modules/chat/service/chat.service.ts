import { repository } from "../../../repository";
import { CreateChatDto } from "../dto/chat.dto";

const saveChat =  async(chatData: CreateChatDto) => {
    try {
        const newChat = await repository.save('chats', chatData);
        return newChat;
    } catch(error) {
        throw error;
    }
}


const updateChat = async(data: any, condition: any) => {
    try {
        return await repository.update('chats', data, condition, true)
    } catch(error) {
        throw error;
    }
}

const findChatById = async(id: number) => {
    try {
        const Chat = await repository.findByCondition('chats', {id});
        return Chat;
    } catch(error) {
        throw error;
    }
}

export {
    saveChat,
    updateChat,
    findChatById
}