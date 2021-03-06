import { Router } from "express";

import validateAdministratorMW from "../middlewares/adverts/validateAdministrator.middleware";
import validateSchemaAdvertMW from "../middlewares/adverts/validateSchemaAdvert.middleware";

import advertDeleteController from "../controllers/adverts/advertDelete.controller";
import advertRegisterController from "../controllers/adverts/advertRegister.controller";
import advertListOneController from "../controllers/adverts/advertListOne.controller";
import advertsListByCompanyController from "../controllers/adverts/advertsListByCompany.controller";
import advertUpdateController from "../controllers/adverts/advertUpdate.controller";
import validateAdmToken from "../middlewares/administrators/authAdm.middelware";
import verifyAdsCompany from "../middlewares/adverts/verifyAdsCompany.middleware";
import verifyToken from "../middlewares/companies/verifyToken.middleware";
import verifyLoggedCompany from "../middlewares/adverts/verifyLoggedCompany.middleware";
import advertsListController from "../controllers/adverts/advertList.controller";
import validateSchema from "../middlewares/validateSchema.middleware";
import updateAdvertSchema from "../schemas/advert/advertSerialize.schema";
import validateSchemaAdvertUpdate from "../middlewares/adverts/validateSchemaUpdate.middleware";

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
  routes.get("/byCompany/:id", 
    validateAdmToken,
    verifyToken,
    advertsListByCompanyController
  );
  routes.get("/:id", 
    validateAdmToken,
    verifyLoggedCompany,
    advertListOneController
  );
  routes.get("/", advertsListController)
  routes.delete("/:id", 
    validateAdmToken,
    verifyLoggedCompany,
    advertDeleteController
  );
  routes.patch("/:id", 
  validateAdmToken,
  verifyLoggedCompany,
  validateSchemaAdvertUpdate(updateAdvertSchema),
  advertUpdateController)

  return routes;
};
