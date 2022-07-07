import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateClient1650015189355 implements MigrationInterface {
  name = 'updateClient1650015189355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "client_favorites_product" ("clientId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_5a58a6de3137caa80cd31027d8d" PRIMARY KEY ("clientId", "productId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f993cf9ff6d7a9fbc376df0dd" ON "client_favorites_product" ("clientId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b98ec66a26d314c5b31ce4bc4e" ON "client_favorites_product" ("productId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "client_favorites_product" ADD CONSTRAINT "FK_6f993cf9ff6d7a9fbc376df0dde" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_favorites_product" ADD CONSTRAINT "FK_b98ec66a26d314c5b31ce4bc4e1" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client_favorites_product" DROP CONSTRAINT "FK_b98ec66a26d314c5b31ce4bc4e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_favorites_product" DROP CONSTRAINT "FK_6f993cf9ff6d7a9fbc376df0dde"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b98ec66a26d314c5b31ce4bc4e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f993cf9ff6d7a9fbc376df0dd"`,
    );
    await queryRunner.query(`DROP TABLE "client_favorites_product"`);
  }
}
