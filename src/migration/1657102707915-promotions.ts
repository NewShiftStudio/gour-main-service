import { MigrationInterface, QueryRunner } from 'typeorm';

export class promotions1657102707915 implements MigrationInterface {
  name = 'promotions1657102707915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_promotions_promotion" ("productId" integer NOT NULL, "promotionId" integer NOT NULL, CONSTRAINT "PK_16a07d75a364abb7eeab1a0ef5d" PRIMARY KEY ("productId", "promotionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bad15b89bddb4043927049ca7" ON "product_promotions_promotion" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d31ff54f6ccad5e5eb2692beb2" ON "product_promotions_promotion" ("promotionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_promotions_promotion" ADD CONSTRAINT "FK_9bad15b89bddb4043927049ca72" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_promotions_promotion" ADD CONSTRAINT "FK_d31ff54f6ccad5e5eb2692beb24" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_promotions_promotion" DROP CONSTRAINT "FK_d31ff54f6ccad5e5eb2692beb24"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_promotions_promotion" DROP CONSTRAINT "FK_9bad15b89bddb4043927049ca72"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d31ff54f6ccad5e5eb2692beb2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bad15b89bddb4043927049ca7"`,
    );
    await queryRunner.query(`DROP TABLE "product_promotions_promotion"`);
  }
}
