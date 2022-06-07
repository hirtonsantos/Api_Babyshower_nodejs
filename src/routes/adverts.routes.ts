import { Router } from "express";
import advertDeleteController from "../controllers/adverts/advertDelete.controller";
import advertUpdateController from "../controllers/adverts/advertUpdate.controller";

const routes = Router();

export const advertsRoutes = () => {
  routes.patch("/", advertUpdateController);
  routes.delete("/", advertDeleteController);

  return routes;
};
