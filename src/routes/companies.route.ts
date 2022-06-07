import { Router } from "express";
import companiesListController from "../controllers/companies/companiesList.controller";
import companyListOneController from "../controllers/companies/companiesListOne.controller";
import companyDeleteController from "../controllers/companies/companyDeleteSelf.controller";
import companyLoginController from "../controllers/companies/companyLogin.controller";
import companyRegisterController from "../controllers/companies/companyRegister.controller";
import companyUpdateController from "../controllers/companies/companyUpdate.controller";

const routes = Router();

export const companiesRoutes = () => {
    routes.post("/", companyRegisterController);
    routes.post("/login", companyLoginController);
    routes.get("/", companiesListController);
    routes.get("/:id", companyListOneController);
    routes.patch("/:id", companyUpdateController);
    routes.delete("/:id", companyDeleteController);

    return routes
}