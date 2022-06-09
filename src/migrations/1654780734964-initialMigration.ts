import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1654780734964 implements MigrationInterface {
    name = 'initialMigration1654780734964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" RENAME COLUMN "passwordHash" TO "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" RENAME COLUMN "password" TO "passwordHash"`);
    }

}
