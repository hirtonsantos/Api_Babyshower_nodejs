import { MigrationInterface, QueryRunner } from "typeorm";

export class addColumnImageAtAdvert1654886037871 implements MigrationInterface {
    name = 'addColumnImageAtAdvert1654886037871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adverts" ADD "image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "adverts" DROP CONSTRAINT "UQ_d8b116a2a81f6c2c8fcda9b3ff8"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adverts" ADD CONSTRAINT "UQ_d8b116a2a81f6c2c8fcda9b3ff8" UNIQUE ("linkAdverts")`);
        await queryRunner.query(`ALTER TABLE "adverts" DROP COLUMN "image"`);
    }

}
