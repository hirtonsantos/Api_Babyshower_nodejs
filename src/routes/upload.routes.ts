import { Router } from "express";
import multer from "multer";
import path from "path";
import multerConfig from "../config/multer"
import { deleteImageController } from "../controllers/upload/deleteImage.controller";
import { postImageController } from "../controllers/upload/postImage.controller";
import validateAdmToken from "../middlewares/administrators/authAdm.middelware";
import authUser from "../middlewares/authUser.middleware";

const routes = Router();

const fields = [
  {name: 'image-profile'},
  {name: 'image-product-1'},
  {name: 'image-product-2'},
  {name: 'image-product-3'},
  {name: 'image-product-4'},
  {name: 'image-advert'},
  {name: 'image-company'},
]

//validateAdmToken because it's general for all instances. => req.decoded => {id: "id"}
export const uploadRoutes = () => {
  routes.post("/",validateAdmToken, multer(multerConfig).fields(fields), postImageController)
  routes.delete("/",validateAdmToken, deleteImageController)

  return routes;
};