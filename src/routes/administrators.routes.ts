import { Router } from "express";

import validateSchema from "../middlewares/validateSchema.middleware";
import loginAdminstratorSchema from "../schemas/administrator/loginAdministrator.schema";

import administratorDeleteService from "../controllers/administrators/administratorsDeleteSelf.controller";
import administratorsListController from "../controllers/administrators/administratorsList.controller";
import administratorLoginController from "../controllers/administrators/administratorsLogin.controller";
import adminstradorRegisterController from "../controllers/administrators/administratorsRegister.controller";
import administratorUpdateController from "../controllers/administrators/administratorUpdate.controller";
import administratorUserController from "../controllers/administrators/administratorUser.controller";

const routes = Router();

export const administratorRoutes = () => {
  routes.post("/", adminstradorRegisterController);
  routes.get("/", administratorsListController);
  routes.get("/:id", administratorUserController);
  routes.post(
    "/login",
    validateSchema(loginAdminstratorSchema),
    administratorLoginController
  );
  routes.patch("/:id", administratorUpdateController);
  routes.delete("/:id", administratorDeleteService);

  return routes;
};
