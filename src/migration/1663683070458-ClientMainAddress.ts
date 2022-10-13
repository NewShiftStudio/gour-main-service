import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientMainAddress1663683070458 implements MigrationInterface {
  name = 'ClientMainAddress1663683070458';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_f3e010b4df6cd1e01ce41573aeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" DROP CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" DROP CONSTRAINT "FK_930110e92aed1778939fdbdb302"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_930110e92aed1778939fdbdb30"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_559e1bc4d01ef1e56d75117ab9"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON "product_category" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON "product_category" ("categoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_category" DROP CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" DROP CONSTRAINT "FK_930110e92aed1778939fdbdb302"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_559e1bc4d01ef1e56d75117ab9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_930110e92aed1778939fdbdb30"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON "product_category" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON "product_category" ("productId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_f3e010b4df6cd1e01ce41573aeb" FOREIGN KEY ("mainOrderProfileId") REFERENCES "order_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
