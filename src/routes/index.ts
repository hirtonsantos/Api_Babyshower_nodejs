import { Express } from "express";
import { administratorRoutes } from "./administrators.routes";
import { advertsRoutes } from "./adverts.routes";
import { companiesRoutes } from "./companies.routes";

export const appRoutes = (app: Express) => {
  app.use("/users", administratorRoutes());
  app.use("/products", advertsRoutes());
  app.use("/companies", companiesRoutes());
};
