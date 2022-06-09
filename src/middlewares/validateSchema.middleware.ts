import { Request, Response, NextFunction } from "express";
import { AnySchema } from "yup";
import { Company } from "../entities/companies.entity";

const validateSchema =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      req.validated = validated as Company;

      return next();
    } catch (err) {
      return res.status(422).json({
        errors: err.errors,
      });
    }
  };

export default validateSchema;
