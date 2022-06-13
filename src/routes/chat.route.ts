import { Router } from "express";
import chatArchiveController from "../controllers/chat/chatArchive.controller";
import chatListController from "../controllers/chat/chatList.controller";
import chatReadController from "../controllers/chat/chatRead.controller";
import createMessageController from "../controllers/chat/messageCreate.controller";

const routes = Router();

export const chatRoutes = () => {
  routes.get("/", chatListController)
  routes.post("/:id", createMessageController);
  routes.get("/:id", chatReadController);
  routes.put("/:id", chatArchiveController)

  return routes;
};