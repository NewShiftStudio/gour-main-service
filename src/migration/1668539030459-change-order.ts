import {MigrationInterface, QueryRunner} from "typeorm";

export class changeOrder1668539030459 implements MigrationInterface {
    name = 'changeOrder1668539030459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_930110e92aed1778939fdbdb302"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_930110e92aed1778939fdbdb30"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_559e1bc4d01ef1e56d75117ab9"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "invoiceUuid" character varying`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_3fb066240db56c9558a91139431"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD "orderId" uuid`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "PK_1031171c13130102495201e3e20"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "firstName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "lastName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON "product_category" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON "product_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_3fb066240db56c9558a91139431" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_930110e92aed1778939fdbdb302"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_3fb066240db56c9558a91139431"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_559e1bc4d01ef1e56d75117ab9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_930110e92aed1778939fdbdb30"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "lastName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "firstName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "PK_1031171c13130102495201e3e20"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD "orderId" integer`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_3fb066240db56c9558a91139431" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "invoiceUuid"`);
        await queryRunner.query(`CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON "product_category" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON "product_category" ("productId") `);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
