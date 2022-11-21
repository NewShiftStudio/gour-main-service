import { MigrationInterface, QueryRunner } from 'typeorm';

export class avatar1664527818157 implements MigrationInterface {
  name = 'avatar1664527818157';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(`ALTER TABLE "client" ADD "avatarId" integer`);
    await queryRunner.query(
      `CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON "product_category" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON "product_category" ("categoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_e6810a06b1e242ee7bc7f8a6d73" FOREIGN KEY ("avatarId") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE "client" DROP CONSTRAINT "FK_e6810a06b1e242ee7bc7f8a6d73"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_559e1bc4d01ef1e56d75117ab9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_930110e92aed1778939fdbdb30"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "avatarId"`);
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
      `ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
