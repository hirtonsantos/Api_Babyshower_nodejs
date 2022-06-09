import { Router } from "express";
import chatArchiveController from "../controllers/chat/chatArchive.controller";
import chatListController from "../controllers/chat/chatList.controller";
import chatReadController from "../controllers/chat/chatRead.controller";
import createMessageController from "../controllers/chat/messageCreate.controller";

const routes = Router();

export const chatRoutes = () => {
  routes.post("/", createMessageController);
  routes.get("/", chatReadController);
  routes.get("/list", chatListController)
  routes.put("/archive", chatArchiveController)

  return routes;
};
