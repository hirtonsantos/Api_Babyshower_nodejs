import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1654781057598 implements MigrationInterface {
    name = 'initialMigration1654781057598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" RENAME COLUMN "password" TO "passwordHash"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" RENAME COLUMN "passwordHash" TO "password"`);
    }

}
