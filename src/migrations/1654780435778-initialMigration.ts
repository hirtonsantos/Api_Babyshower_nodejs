import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1654780435778 implements MigrationInterface {
    name = 'initialMigration1654780435778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "UQ_a5d9bb67a706c5ab27b4f6696fd" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "UQ_703760d095b8e399e34950f4960"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "cnpj"`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "cnpj" character varying(14) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "UQ_703760d095b8e399e34950f4960" UNIQUE ("cnpj")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "UQ_703760d095b8e399e34950f4960"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "cnpj"`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "cnpj" character varying(11) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "UQ_703760d095b8e399e34950f4960" UNIQUE ("cnpj")`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "UQ_a5d9bb67a706c5ab27b4f6696fd"`);
    }

}
