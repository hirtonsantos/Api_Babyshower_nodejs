import { Router } from "express";
import chatArchiveController from "../controllers/chat/chatArchive.controller";
import chatListController from "../controllers/chat/chatList.controller";
import chatReadController from "../controllers/chat/chatRead.controller";
import createMessageController from "../controllers/chat/messageCreate.controller";
import validateAdmToken from "../middlewares/administrators/authAdm.middelware";

const routes = Router();

export const chatRoutes = () => {
  routes.get("/", validateAdmToken, chatListController);
  routes.post("/:id", validateAdmToken, createMessageController);
  routes.get("/:id", validateAdmToken, chatReadController);
  routes.patch("/:id", validateAdmToken, chatArchiveController);

  return routes;
};
