import {MigrationInterface, QueryRunner} from "typeorm";

export class promoCode1670235597129 implements MigrationInterface {
    name = 'promoCode1670235597129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_930110e92aed1778939fdbdb302"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_930110e92aed1778939fdbdb30"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_559e1bc4d01ef1e56d75117ab9"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "promoCodeId" integer`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "comment" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "promo_code" ALTER COLUMN "totalCount" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON "product_category" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON "product_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_871b296da0e861e1c301756faee" FOREIGN KEY ("promoCodeId") REFERENCES "promo_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_930110e92aed1778939fdbdb302"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_871b296da0e861e1c301756faee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_559e1bc4d01ef1e56d75117ab9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_930110e92aed1778939fdbdb30"`);
        await queryRunner.query(`ALTER TABLE "promo_code" ALTER COLUMN "totalCount" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "comment" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "promoCodeId"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "order" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON "product_category" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON "product_category" ("productId") `);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
