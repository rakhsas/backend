import 'reflect-metadata'; // Required for decorators if you are using them
import logger from './core/logger/logger';
import { connectWithRetry } from './core/dbconfig/config';
import './core/logger/file-watcher';
import loadEntities from './core/dbconfig/load';
import express from 'express';
import routes from './shared/routes';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { Server } from "socket.io";
import cors from 'cors'
import { add } from 'winston';
import { CreateChatDto } from './modules/chat/dto/chat.dto';
import { saveChat } from './modules/chat/service/chat.service';


function addUser(socketId: string, userId: string, map: Map<string, string>) {
	if (!map.has(socketId)) {
		map.set(socketId, userId);
	}
}
async function bootstrap() {
	try {
		const app = express();
		app.use(express.json());
		app.use(cookieParser());
		// cors
		app.use(
			cors({
				origin: 'http://localhost:4200',
				credentials: true,
			})
		);
		app.use(
			session({
			  secret: process.env.JWT_SECRET as string,
			  resave: false,
			  saveUninitialized: false,
			})
		  );
		  app.use(passport.initialize());
		  app.use(passport.session());
		dotenv.config();

		logger.info('Starting application...');

		try {
			routes(app);
		} catch (err: any) {
			throw new Error(`Failed to setup routes: ${err.message}`);
		}

		try {
			await connectWithRetry();
		} catch (err: any) {
			throw new Error(`Database connection failed: ${err.message}`);
		}

		try {
			// console.log(__dirname);
			loadEntities(__dirname);
		} catch (err: any) {
			throw new Error(`Failed to load entities: ${err.message}`);
		}
		const port = process.env.PORT || 3000;
		
		const map: Map<string, string> = new Map();
		
		const io = new Server(3000, {
			cors: {
				origin: "*",
			}
		});
		
		io.on("connection", (socket) => {
			console.log("A user connected:", socket.id);
		
			socket.on("message", async (data) => {
				console.log("Received message:", data);
				const { 
					sender_id, 
					receiver_id, 
					type, 
					message, 
					media_url 
				} = data;
				if (!sender_id || !receiver_id || !message) {
					return socket.emit("error", { message: "Missing required fields" });
				}
				try {
					const chatDto = new CreateChatDto({
						sender_id,
						receiver_id,
						type,
						message,
						media_url,
					});
					const newChat = await saveChat(chatDto);
					io.emit("message", newChat);
				} catch (error) {
					console.error("Error saving message:", error);
					socket.emit("error", { message: "Failed to save message" });
				}
			});
		
			socket.on("disconnect", () => {
				console.log("User disconnected:", socket.id);
			});
		});
		logger.info('Application initialized successfully!');
	} catch (error: any) {
		logger.error({
			message: 'Failed to start the application',
			errorName: error.name,
			errorMessage: error.message,
			stack: error.stack,
		});
		process.exit(1); // Exit the process in case of a critical error
	}
}

bootstrap();
