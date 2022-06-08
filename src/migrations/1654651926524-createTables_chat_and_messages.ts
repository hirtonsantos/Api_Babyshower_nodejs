import { MigrationInterface, QueryRunner } from "typeorm";

export class createTablesChatAndMessages1654651926524 implements MigrationInterface {
    name = 'createTablesChatAndMessages1654651926524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL, "message" character varying NOT NULL, "read_message" boolean NOT NULL DEFAULT false, "parent_id" integer NOT NULL, "chat_id" integer NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" uuid NOT NULL, "created_at" character varying NOT NULL, "updated_at" character varying NOT NULL, "archived" boolean NOT NULL DEFAULT false, "parent_id_main" integer NOT NULL, "parent_id_retrieve" integer NOT NULL, "messagesId" uuid, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_eab3b0dffc53c414f906c16efdc" FOREIGN KEY ("messagesId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_eab3b0dffc53c414f906c16efdc"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
