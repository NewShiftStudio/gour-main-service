import {MigrationInterface, QueryRunner} from "typeorm";

export class orderIds1668180608758 implements MigrationInterface {
    name = 'orderIds1668180608758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_930110e92aed1778939fdbdb302"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_930110e92aed1778939fdbdb30"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_559e1bc4d01ef1e56d75117ab9"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "warehouseId" character varying`);
        await queryRunner.query(`ALTER TABLE "page" ADD "bannerImgId" integer`);
        await queryRunner.query(`ALTER TYPE "public"."order_status_enum" RENAME TO "order_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('init', 'confirmed', 'receipt', 'payment', 'paid', 'assembly', 'assembled', 'delivery', 'delivered', 'refund', 'cancelled', 'deleted')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" TYPE "public"."order_status_enum" USING "status"::"text"::"public"."order_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON "product_category" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON "product_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "page" ADD CONSTRAINT "FK_c556dc2faf602f21bbfefef8350" FOREIGN KEY ("bannerImgId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_930110e92aed1778939fdbdb302"`);
        await queryRunner.query(`ALTER TABLE "page" DROP CONSTRAINT "FK_c556dc2faf602f21bbfefef8350"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_559e1bc4d01ef1e56d75117ab9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_930110e92aed1778939fdbdb30"`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum_old" AS ENUM('init', 'basketFilling', 'registration', 'payment', 'paid', 'atThePointOfIssue', 'delivery', 'completed', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" TYPE "public"."order_status_enum_old" USING "status"::"text"::"public"."order_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_status_enum_old" RENAME TO "order_status_enum"`);
        await queryRunner.query(`ALTER TABLE "page" DROP COLUMN "bannerImgId"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "warehouseId"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "firstName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "phone" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON "product_category" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON "product_category" ("productId") `);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
