import { MigrationInterface, QueryRunner } from "typeorm";

export class createKeyDate1654824935992 implements MigrationInterface {
    name = 'createKeyDate1654824935992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "createdAt" character varying NOT NULL`);
    }

}
