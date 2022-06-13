import { Router } from "express";
import administratorDeleteService from "../controllers/administrators/administratorsDeleteSelf.controller";
import administratorsListController from "../controllers/administrators/administratorsList.controller";
import administratorLoginController from "../controllers/administrators/administratorsLogin.controller";
import administratorRegisterController from "../controllers/administrators/administratorsRegister.controller";
import administratorUpdateController from "../controllers/administrators/administratorUpdate.controller";
import administratorUserController from "../controllers/administrators/administratorUser.controller";
import validateAdmToken from "../middlewares/administrators/authAdm.middelware";

import verifyUniqueValuesAdmin from "../middlewares/administrators/verifyAdmUniqueValues.middleware";
import verifyIfAdm from "../middlewares/administrators/verifyIfAdm.middleware";
import validateSchema from "../middlewares/validateSchema.middleware";
import { registerAdminSchema } from "../schemas/administrators/renameAdmin.schema";

const routes = Router();

export const administratorRoutes = () => {
  routes.post("/",
    validateAdmToken,
    verifyIfAdm, 
    validateSchema(registerAdminSchema),
    verifyUniqueValuesAdmin,
    administratorRegisterController);
  routes.get("/", administratorsListController);
  routes.get("/:id", administratorUserController);
  routes.post("/login", administratorLoginController);
  routes.patch("/:id", administratorUpdateController);
  routes.delete("/:id", administratorDeleteService);

  return routes;
};
