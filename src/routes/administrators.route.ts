import { Router } from "express";

import validateSchema from "../middlewares/validateSchema.middleware";
import verifyUniqueValuesAdmin from "../middlewares/administrators/verifyUniqueValuesAdm.middleware";
import {registerAdminSchema} from "../schemas/administrator/renameAdmin.schema"
import validateToken  from "../middlewares/administrators/verifyAuthToken.middleware";
import verifyIfAdm from "../middlewares/administrators/verifyAdm.middleware";

import administratorDeleteService from "../controllers/administrators/administratorsDeleteSelf.controller";
import administratorsListController from "../controllers/administrators/administratorsList.controller";
import administratorLoginController from "../controllers/administrators/administratorsLogin.controller";
import adminstradorRegisterController from "../controllers/administrators/administratorsRegister.controller";
import administratorUpdateController from "../controllers/administrators/administratorUpdate.controller";
import administratorUserController from "../controllers/administrators/administratorUser.controller";

const routes = Router();

export const administratorRoutes = () => {
  routes.post("/", 
    validateToken,
    // verifyIfAdm,
    validateSchema(registerAdminSchema),
    verifyUniqueValuesAdmin, 
    adminstradorRegisterController
  );
  routes.get("/", administratorsListController);
  routes.get("/:id", administratorUserController);
  routes.post("/login", administratorLoginController);
  routes.patch("/:id", administratorUpdateController);
  routes.delete("/:id", administratorDeleteService);

  return routes;
};
