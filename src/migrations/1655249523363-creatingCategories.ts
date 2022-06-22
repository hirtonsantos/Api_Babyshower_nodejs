import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuid } from "uuid";

export class creatingCategories1655249523363 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        INSERT INTO "categories_adverts" ("id", "title", "price", "description")
            VALUES 
            ('${uuid()}', 'Premium', 500.00, 'Our most expensive plan.'),
            ('${uuid()}', 'Platinum', 350.00, 'Our medium price plan.'),
            ('${uuid()}', 'Black', 200.00, 'Our cheapest price plan.');
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
