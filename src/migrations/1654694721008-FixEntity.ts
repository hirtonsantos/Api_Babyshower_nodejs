import { MigrationInterface, QueryRunner } from "typeorm";

export class FixEntity1654694721008 implements MigrationInterface {
    name = 'FixEntity1654694721008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adverts" DROP CONSTRAINT "FK_99e0e0333eb154bb20959f04fba"`);
        await queryRunner.query(`ALTER TABLE "adverts" RENAME COLUMN "companieId" TO "companyId"`);
        await queryRunner.query(`ALTER TABLE "adverts" ADD CONSTRAINT "FK_909d0d464ea6285725f6c8a45d7" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adverts" DROP CONSTRAINT "FK_909d0d464ea6285725f6c8a45d7"`);
        await queryRunner.query(`ALTER TABLE "adverts" RENAME COLUMN "companyId" TO "companieId"`);
        await queryRunner.query(`ALTER TABLE "adverts" ADD CONSTRAINT "FK_99e0e0333eb154bb20959f04fba" FOREIGN KEY ("companieId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
