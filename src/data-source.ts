import "reflect-metadata";
import path from "path";
import { DataSource } from "typeorm";
import fs from 'fs'

import * as dotenv from "dotenv";

dotenv.config();

if (!fs.existsSync("tmp/uploads")){
    fs.mkdirSync("tmp/uploads", {recursive: true});
}

export const AppDataSource =
  process.env.NODE_ENV === "test"
    ? new DataSource({
        type: "sqlite",
        database: ":memory:",
        entities: [path.join(__dirname, "/entities/*.ts")],
        synchronize: true,
      })
    : new DataSource({
        type: "postgres",
        url: process.env.DATABASE_URL,
        ssl:
          process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
        synchronize: false,
        logging: true,
        entities:
          process.env.NODE_ENV === "production"
            ? ["dist/src/entities/*.js"]
            : ["src/entities/*.ts"],
        migrations:
          process.env.NODE_ENV === "production"
            ? ["dist/src/migrations/*.js"]
            : ["src/migrations/*.ts"],
      });
