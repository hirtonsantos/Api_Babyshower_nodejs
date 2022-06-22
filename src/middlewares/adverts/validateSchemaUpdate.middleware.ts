import { Request, Response, NextFunction } from "express";
import { AnySchema } from "yup";

const validateSchemaAdvertUpdate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      req.validatedAd = validated;

      return next();
    } catch (err) {
      return res.status(400).json({
        errors: err.errors,
      });
    }
  };

export default validateSchemaAdvertUpdate;
