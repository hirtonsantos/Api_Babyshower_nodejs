import { MigrationInterface, QueryRunner } from "typeorm";

export class modifyColumnInAdverts1654890418234 implements MigrationInterface {
    name = 'modifyColumnInAdverts1654890418234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adverts" DROP CONSTRAINT "UQ_4f02a13d3b5ec8bd371d4bdb2a8"`);
        await queryRunner.query(`ALTER TABLE "adverts" ALTER COLUMN "linkAdverts" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "adverts" ALTER COLUMN "image" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adverts" ALTER COLUMN "image" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "adverts" ALTER COLUMN "linkAdverts" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "adverts" ADD CONSTRAINT "UQ_4f02a13d3b5ec8bd371d4bdb2a8" UNIQUE ("apliedPrice")`);
    }

}
