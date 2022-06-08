import { Router } from "express";
import createMessageController from "../controllers/chat/createMessage.controller";

const routes = Router();

export const chatRoutes = () => {
  routes.post("/", createMessageController);

  return routes;
};
