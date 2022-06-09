import { Router } from "express";

import validateSchema from "../middlewares/validateSchema.middleware";
import { registerCompanySchema } from "../schemas/company/renameCompany.schema";
import loginUserSchema from "../schemas/company/loginUserSchema.schema"
import verifyUniqueValuesMW from "../middlewares/companies/verifyUniqueValues.middleware";

import companiesListController from "../controllers/companies/companiesList.controller";
import companyListOneController from "../controllers/companies/companiesListOne.controller";
import companyDeleteController from "../controllers/companies/companyDeleteSelf.controller";
import companyLoginController from "../controllers/companies/companyLogin.controller";
import companyRegisterController from "../controllers/companies/companyRegister.controller";
import companyUpdateController from "../controllers/companies/companyUpdate.controller";

const routes = Router();

export const companiesRoutes = () => {
  routes.post(
    "/",
    validateSchema(registerCompanySchema),
    verifyUniqueValuesMW,
    companyRegisterController
  );
  routes.post("/login", validateSchema(loginUserSchema), companyLoginController);
  routes.get("/", companiesListController);
  routes.get("/:id", companyListOneController);
  routes.patch("/:id", companyUpdateController);
  routes.delete("/:id", companyDeleteController);

  return routes;
};
