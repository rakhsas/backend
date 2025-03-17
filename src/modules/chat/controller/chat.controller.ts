import { Request, Response } from 'express';
import HttpStatus from 'http-status';
import { CreateChatDto } from '../dto/chat.dto';
import * as ChatSerive from '../service/chat.service'

export const CreateChat = async (req: Request, res: Response) => {
    try {
        const ChatDto = new CreateChatDto(req.body);
        const newChat = await ChatSerive.saveChat(ChatDto);
        res.status(
			HttpStatus.CREATED
		).json({
			message: 'Chat created successfully',
			user: newChat,
		});
    } catch (error: any) {
        res.
            status(error.statusCode ||
                HttpStatus.INTERNAL_SERVER_ERROR
            )
            .json({
                error: error.message
            })
    }
}


export const UpdateChat = async (req: Request, res: Response) => {
    try {
        const ChatDto = new CreateChatDto(req.body);
        const newChat = await ChatSerive.updateChat(ChatDto, true);
        res.status(
			HttpStatus.CREATED
		).json({
			message: 'Chat update successfully',
			user: newChat,
		});
    } catch (error: any) {
        res.
            status(error.statusCode ||
                HttpStatus.INTERNAL_SERVER_ERROR
            )
            .json({
                error: error.message
            })
    }
}


export const findSpecifyChat = async(id: number) => {
    try {
        const Chat = await ChatSerive.findChatById(id);
        return Chat;
    } catch (error: any) {
        throw error;
    }
}