import { MigrationInterface, QueryRunner } from "typeorm";

export class createTablesChatAndMessage1654746187394 implements MigrationInterface {
    name = 'createTablesChatAndMessage1654746187394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL, "message" character varying NOT NULL, "read_message" boolean NOT NULL DEFAULT false, "parent_id" character varying NOT NULL, "chatId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" uuid NOT NULL, "created_at" character varying NOT NULL, "updated_at" character varying NOT NULL, "archived" boolean NOT NULL DEFAULT false, "parent_user" character varying NOT NULL, "other_parent_user" character varying NOT NULL, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
