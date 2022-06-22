import { Router } from "express";
import advertDeleteController from "../controllers/adverts/advertDelete.controller";
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
import validateSchemaAdvert from "../middlewares/adverts/validateSchemaAdvert.middleware";

const routes = Router();

export const advertsRoutes = () => {
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
  validateSchemaAdvert(updateAdvertSchema),
  advertUpdateController)

  return routes;
};
