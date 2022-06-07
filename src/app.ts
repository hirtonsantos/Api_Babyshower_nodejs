import express from "express";
import { appRoutes } from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { Request, Response } from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

appRoutes(app);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World",
  });
});

app.use(errorMiddleware);

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
