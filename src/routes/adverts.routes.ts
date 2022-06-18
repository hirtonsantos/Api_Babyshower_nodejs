import { Router } from "express";

import validateAdministratorMW from "../middlewares/adverts/validateAdministrator.middleware";
import validateSchemaAdvertMW from "../middlewares/adverts/validateSchemaAdvert.middleware";

import advertDeleteController from "../controllers/adverts/advertDelete.controller";
import advertRegisterController from "../controllers/adverts/advertRegister.controller";
import advertUpdateController from "../controllers/adverts/advertUpdate.controller";

import registerAdvertSchema from "../schemas/adverts/registerAdvert.schema";

const routes = Router();

export const advertsRoutes = () => {
  routes.post(
    "/byCompany/:id",
    validateSchemaAdvertMW(registerAdvertSchema),
    validateAdministratorMW,
    advertRegisterController
  );
  routes.patch("/", advertUpdateController);
  routes.delete("/", advertDeleteController);

  return routes;
};
