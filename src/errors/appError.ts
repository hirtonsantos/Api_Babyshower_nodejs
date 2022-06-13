import { Response } from "express";

export class AppError {
  public statusCode: number;
  public message: Record<string, any>;

  constructor(statusCode: number, message: Record<string, any>) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const handleError = (err: AppError, res: Response) => {
  const { statusCode, message } = err;

  return res.status(statusCode).json(message);
};