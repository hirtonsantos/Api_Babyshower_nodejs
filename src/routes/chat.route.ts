import { Router } from "express";
import chatReadController from "../controllers/chat/chatList.controller";
import createMessageController from "../controllers/chat/messageCreate.controller";

const routes = Router();

export const chatRoutes = () => {
  routes.post("/", createMessageController);
  routes.get("/", chatReadController);

  return routes;
};
