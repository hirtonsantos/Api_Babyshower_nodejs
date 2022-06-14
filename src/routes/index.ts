import { Express } from "express";
import { administratorRoutes } from "./administrators.routes";
import { advertsRoutes } from "./adverts.routes";
import { companiesRoutes } from "./companies.routes";
import { chatRoutes } from "./chat.route";

export const appRoutes = (app: Express) => {
  app.use("/administrators", administratorRoutes());
  app.use("/products", advertsRoutes());
  app.use("/companies", companiesRoutes());
  app.use("/chat", chatRoutes());
};
