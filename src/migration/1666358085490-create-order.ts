import {MigrationInterface, QueryRunner} from "typeorm";

export class createOrder1666358085490 implements MigrationInterface {
    name = 'createOrder1666358085490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_e6810a06b1e242ee7bc7f8a6d73"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_930110e92aed1778939fdbdb302"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_930110e92aed1778939fdbdb30"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_559e1bc4d01ef1e56d75117ab9"`);
        await queryRunner.query(`ALTER TABLE "order_product" RENAME COLUMN "weight" TO "gram"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "REL_f3e010b4df6cd1e01ce41573ae"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "UQ_e6810a06b1e242ee7bc7f8a6d73"`);
        await queryRunner.query(`ALTER TABLE "order_product" ALTER COLUMN "gram" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON "product_category" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON "product_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_e6810a06b1e242ee7bc7f8a6d73" FOREIGN KEY ("avatarId") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_930110e92aed1778939fdbdb302"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_e6810a06b1e242ee7bc7f8a6d73"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_559e1bc4d01ef1e56d75117ab9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_930110e92aed1778939fdbdb30"`);
        await queryRunner.query(`ALTER TABLE "order_product" ALTER COLUMN "gram" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "UQ_e6810a06b1e242ee7bc7f8a6d73" UNIQUE ("avatarId")`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "REL_f3e010b4df6cd1e01ce41573ae" UNIQUE ("mainOrderProfileId")`);
        await queryRunner.query(`ALTER TABLE "order_product" RENAME COLUMN "gram" TO "weight"`);
        await queryRunner.query(`CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON "product_category" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON "product_category" ("productId") `);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_e6810a06b1e242ee7bc7f8a6d73" FOREIGN KEY ("avatarId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
