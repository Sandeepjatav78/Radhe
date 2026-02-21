import express from "express";
import { askChatbot, getChatbotFaqs } from "../controllers/chatbotController.js";

const chatbotRouter = express.Router();

chatbotRouter.post("/ask", askChatbot);
chatbotRouter.get("/faqs", getChatbotFaqs);

export default chatbotRouter;
