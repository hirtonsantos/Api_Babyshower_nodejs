import { Router } from "express";
import multer from "multer";
import path from "path";
import multerConfig from "../config/multer"
import { postImageController } from "../controllers/upload/postImage.controller";

const routes = Router();

export const uploadRoutes = () => {
  routes.post("/image-profile", multer(multerConfig).single("image-profile"), postImageController)
/*   routes.post("/image-product-1", multer(multerConfig).single("image-product-1"), postImageController)
  routes.post("/image-product-2", multer(multerConfig).single("image-product-2"), postImageController)
  routes.post("/image-product-3", multer(multerConfig).single("image-product-3"), postImageController)
  routes.post("/image-product-4", multer(multerConfig).single("image-product-4"), postImageController)
  routes.post("/image-advert", multer(multerConfig).single("image-advert"), postImageController)
  routes.post("/image-company", multer(multerConfig).single("image-company"), postImageController) */

  return routes;
};