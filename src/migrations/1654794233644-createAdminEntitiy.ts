import { MigrationInterface, QueryRunner } from "typeorm";

import * as dotenv from "dotenv";
import { hashSync } from "bcrypt";
import { v4 as uuid } from "uuid";

dotenv.config();

let adminPassword: string;

if (process.env.ADMIN_PASSWORD) {
  adminPassword = process.env.ADMIN_PASSWORD;
} else {
  throw new Error("ADMIN_PASSWORD is not defined on .env");
}

export class createAdminEntitiy1654794233644 implements MigrationInterface {
  name = "createAdminEntitiy1654794233644";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "administrators" ("id" uuid NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, CONSTRAINT "UQ_f191e970d8ff9f2cd332025714b" UNIQUE ("username"), CONSTRAINT "UQ_4ee5216a00cb99b2dede98509c1" UNIQUE ("email"), CONSTRAINT "PK_aaa48522d99c3b6b33fdea7dc2f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "categories_adverts" ("id" uuid NOT NULL, "title" character varying NOT NULL, "price" double precision NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_b11fc694ab657b64e072d553e04" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "companies" ("id" uuid NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "razaoSocial" character varying NOT NULL, "cnpj" character varying(14) NOT NULL, "phone" character varying, "logoImage" character varying, CONSTRAINT "UQ_a5d9bb67a706c5ab27b4f6696fd" UNIQUE ("username"), CONSTRAINT "UQ_d0af6f5866201d5cb424767744a" UNIQUE ("email"), CONSTRAINT "UQ_703760d095b8e399e34950f4960" UNIQUE ("cnpj"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "adverts" ("id" uuid NOT NULL, "title" character varying NOT NULL, "apliedPrice" double precision NOT NULL, "description" character varying NOT NULL, "linkAdverts" character varying NOT NULL, "companyId" uuid, "categoryId" uuid, CONSTRAINT "UQ_4f02a13d3b5ec8bd371d4bdb2a8" UNIQUE ("apliedPrice"), CONSTRAINT "UQ_d8b116a2a81f6c2c8fcda9b3ff8" UNIQUE ("linkAdverts"), CONSTRAINT "PK_36876931b51109a932d0bf3b40a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "adverts" ADD CONSTRAINT "FK_909d0d464ea6285725f6c8a45d7" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "adverts" ADD CONSTRAINT "FK_0205250596c0cd14902121a382a" FOREIGN KEY ("categoryId") REFERENCES "categories_adverts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `INSERT INTO "administrators" ("id", "username", "email", "passwordHash")
        VALUES ('${uuid()}', '${process.env.ADMIN_USERNAME}', '${
        process.env.ADMIN_EMAIL
      }', '${hashSync(adminPassword, 10)}')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "adverts" DROP CONSTRAINT "FK_0205250596c0cd14902121a382a"`
    );
    await queryRunner.query(
      `ALTER TABLE "adverts" DROP CONSTRAINT "FK_909d0d464ea6285725f6c8a45d7"`
    );
    await queryRunner.query(`DROP TABLE "adverts"`);
    await queryRunner.query(`DROP TABLE "companies"`);
    await queryRunner.query(`DROP TABLE "categories_adverts"`);
    await queryRunner.query(`DROP TABLE "administrators"`);
  }
}
