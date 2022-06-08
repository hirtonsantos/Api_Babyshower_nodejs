import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTypeIdOfTables1654654986310 implements MigrationInterface {
    name = 'updateTypeIdOfTables1654654986310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "parent_id"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "parent_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "chat_id"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "chat_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "parent_id_main"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "parent_id_main" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "parent_id_retrieve"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "parent_id_retrieve" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "parent_id_retrieve"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "parent_id_retrieve" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "parent_id_main"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "parent_id_main" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "chat_id"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "chat_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "parent_id"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "parent_id" integer NOT NULL`);
    }

}
