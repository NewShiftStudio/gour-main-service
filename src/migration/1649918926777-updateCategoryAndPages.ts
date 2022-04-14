import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateCategoryAndPages1649918926777 implements MigrationInterface {
  name = 'updateCategoryAndPages1649918926777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "page" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "key" character varying NOT NULL, "info" json NOT NULL, "metaId" integer, CONSTRAINT "PK_742f4117e065c5b6ad21b37ba1f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "icon"`);
    await queryRunner.query(
      `ALTER TABLE "page" ADD CONSTRAINT "FK_7cefdc1a09fcac0b34480032046" FOREIGN KEY ("metaId") REFERENCES "page_meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "page" DROP CONSTRAINT "FK_7cefdc1a09fcac0b34480032046"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD "icon" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "page"`);
  }
}
