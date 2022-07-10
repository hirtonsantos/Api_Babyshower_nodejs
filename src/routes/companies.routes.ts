import { Router } from "express";

import validateSchema from "../middlewares/validateSchema.middleware";
import { registerCompanySchema } from "../schemas/company/renameCompany.schema";
import verifyUniqueValuesMW from "../middlewares/companies/verifyUniqueValues.middleware";
import loginUserSchema from "../schemas/company/loginUserSchema.schema";
import verifyToken from "../middlewares/companies/verifyToken.middleware";
import validateAdmToken from "../middlewares/administrators/authAdm.middelware";

import companiesListController from "../controllers/companies/companiesList.controller";
import companyListOneController from "../controllers/companies/companiesListOne.controller";
import companyDeleteController from "../controllers/companies/companyDeleteSelf.controller";
import companyLoginController from "../controllers/companies/companyLogin.controller";
import companyRegisterController from "../controllers/companies/companyRegister.controller";
import companyUpdateController from "../controllers/companies/companyUpdate.controller";
import verifyIfAdm from "../middlewares/administrators/verifyIfAdm.middleware";

const routes = Router();

export const companiesRoutes = () => {
  routes.post(
    "/",
    validateSchema(registerCompanySchema),
    verifyUniqueValuesMW,
    companyRegisterController
  );
  routes.post(
    "/login",
    validateSchema(loginUserSchema),
    companyLoginController
  );
  routes.get("/", validateAdmToken, verifyIfAdm, companiesListController);
  routes.get("/:id", validateAdmToken, verifyToken, companyListOneController);
  routes.patch(
    "/:id",
    validateAdmToken,
    validateSchema(registerCompanySchema),
    verifyUniqueValuesMW,
    verifyToken,
    companyUpdateController
  );
  routes.delete("/:id", validateAdmToken, verifyToken, companyDeleteController);

  return routes;
};
