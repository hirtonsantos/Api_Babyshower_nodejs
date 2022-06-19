import { Router } from "express";
import advertDeleteController from "../controllers/adverts/advertDelete.controller";
import advertListOneController from "../controllers/adverts/advertListOne.controller";
import advertsListByCompanyController from "../controllers/adverts/advertsListByCompany.controller";
import advertUpdateController from "../controllers/adverts/advertUpdate.controller";
import validateAdmToken from "../middlewares/administrators/authAdm.middelware";
import verifyAdsCompany from "../middlewares/adverts/verifyAdsCompany.middleware";
import verifyToken from "../middlewares/companies/verifyToken.middleware";
import verifyLoggedCompany from "../middlewares/adverts/verifyLoggedCompany.middleware";

const routes = Router();

export const advertsRoutes = () => {
  routes.patch("/", advertUpdateController);
  routes.delete("/", advertDeleteController);
  routes.get("/byCompany/:id", 
    validateAdmToken,
    verifyToken,
    advertsListByCompanyController
  );
  routes.get("/:id", 
    validateAdmToken,
    // verifyAdsCompany,
    verifyLoggedCompany,
    advertListOneController
  );

  return routes;
};
