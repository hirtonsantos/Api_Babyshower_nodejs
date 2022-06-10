import { MigrationInterface, QueryRunner } from "typeorm";

export class updateKeysinChatAndMessage1654816971836 implements MigrationInterface {
    name = 'updateKeysinChatAndMessage1654816971836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "createdAt" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "parent_id"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "parent_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "parent_user"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "parent_user" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "other_parent_user"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "other_parent_user" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "other_parent_user"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "other_parent_user" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" DROP COLUMN "parent_user"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "parent_user" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "parent_id"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "parent_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "updated_at" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ADD "created_at" character varying NOT NULL`);
    }

}
