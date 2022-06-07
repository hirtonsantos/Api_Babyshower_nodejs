import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablesCompaniesAdsCategory1654614119917 implements MigrationInterface {
    name = 'CreateTablesCompaniesAdsCategory1654614119917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories_adverts" ("id" uuid NOT NULL, "title" character varying NOT NULL, "price" double precision NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_b11fc694ab657b64e072d553e04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "razaoSocial" character varying NOT NULL, "cnpj" character varying(11) NOT NULL, "phone" character varying, "logoImage" character varying, CONSTRAINT "UQ_d0af6f5866201d5cb424767744a" UNIQUE ("email"), CONSTRAINT "UQ_703760d095b8e399e34950f4960" UNIQUE ("cnpj"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "adverts" ("id" uuid NOT NULL, "title" character varying NOT NULL, "apliedPrice" double precision NOT NULL, "description" character varying NOT NULL, "linkAdverts" character varying NOT NULL, "companieId" uuid, "categoryId" uuid, CONSTRAINT "UQ_4f02a13d3b5ec8bd371d4bdb2a8" UNIQUE ("apliedPrice"), CONSTRAINT "UQ_d8b116a2a81f6c2c8fcda9b3ff8" UNIQUE ("linkAdverts"), CONSTRAINT "PK_36876931b51109a932d0bf3b40a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "adverts" ADD CONSTRAINT "FK_99e0e0333eb154bb20959f04fba" FOREIGN KEY ("companieId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adverts" ADD CONSTRAINT "FK_0205250596c0cd14902121a382a" FOREIGN KEY ("categoryId") REFERENCES "categories_adverts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adverts" DROP CONSTRAINT "FK_0205250596c0cd14902121a382a"`);
        await queryRunner.query(`ALTER TABLE "adverts" DROP CONSTRAINT "FK_99e0e0333eb154bb20959f04fba"`);
        await queryRunner.query(`DROP TABLE "adverts"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "categories_adverts"`);
    }

}
