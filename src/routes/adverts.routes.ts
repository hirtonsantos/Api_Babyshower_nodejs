import { Router } from "express";
import advertDeleteController from "../controllers/adverts/advertDelete.controller";
import advertListOneController from "../controllers/adverts/advertListOne.controller";
import advertsListByCompanyController from "../controllers/adverts/advertsListByCompany.controller";
import advertUpdateController from "../controllers/adverts/advertUpdate.controller";
import validateAdmToken from "../middlewares/administrators/authAdm.middelware";
import verifyToken from "../middlewares/companies/verifyToken.middleware";

const routes = Router();

export const advertsRoutes = () => {
  routes.patch("/", advertUpdateController);
  routes.delete("/", advertDeleteController);
  routes.get("/byCompany/:companyId", 
    // validateAdmToken,
    // verifyToken,
    advertsListByCompanyController
  );
  // routes.get("/:id", 
  //   validateAdmToken,
  //   verifyToken,
  //   advertListOneController
  // )

  return routes;
};
