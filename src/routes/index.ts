import { Express } from "express";
import { administratorRoutes } from "./administrators.routes";
import { advertsRoutes } from "./adverts.routes";
import { companiesRoutes } from "./companies.routes";
import { chatRoutes } from "./chat.route";
import { uploadRoutes } from "./upload.routes";
import authUser from "../middlewares/authUser.middleware";

export const appRoutes = (app: Express) => {
  app.use("/administrators", administratorRoutes());
  app.use("/products", advertsRoutes());
  app.use("/companies", companiesRoutes());
  app.use("/chat", chatRoutes());
  app.use("/upload", uploadRoutes())
};
