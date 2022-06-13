import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError, handleError } from "../errors/appError";

const authUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization

    if (!token) {
      throw new AppError(401, "missing authorization token");
    }

    jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({
            error: {
              name: "JsonWebTokenError",
              message: "jwt malformed",
            },
          });
        }
        req.userId = decoded.id;
        next();
      }
    );
  } catch (err) {
    if (err instanceof AppError) {
      handleError(err, res);
    }
  }
}

export default authUser