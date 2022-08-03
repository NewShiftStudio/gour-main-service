import {MigrationInterface, QueryRunner} from "typeorm";

export class cascade1659104361257 implements MigrationInterface {
    name = 'cascade1659104361257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_grade" DROP CONSTRAINT "FK_4d957dd2ce451c778ba4f853af8"`);
        await queryRunner.query(`ALTER TABLE "product_grade" DROP CONSTRAINT "FK_ed279cf7798d3345643be600567"`);
        await queryRunner.query(`ALTER TABLE "role_discount" DROP CONSTRAINT "FK_a69dad1a9445e23f892cbffaadf"`);
        await queryRunner.query(`ALTER TABLE "role_discount" ALTER COLUMN "roleId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_grade" ALTER COLUMN "productId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_596dadf4ff5b01bd50869c57993"`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "roleId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`);
        await queryRunner.query(`ALTER TABLE "order_product" ALTER COLUMN "productId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_discount" ADD CONSTRAINT "FK_a69dad1a9445e23f892cbffaadf" FOREIGN KEY ("roleId") REFERENCES "client_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_grade" ADD CONSTRAINT "FK_ed279cf7798d3345643be600567" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_grade" ADD CONSTRAINT "FK_4d957dd2ce451c778ba4f853af8" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_596dadf4ff5b01bd50869c57993" FOREIGN KEY ("roleId") REFERENCES "client_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_596dadf4ff5b01bd50869c57993"`);
        await queryRunner.query(`ALTER TABLE "product_grade" DROP CONSTRAINT "FK_4d957dd2ce451c778ba4f853af8"`);
        await queryRunner.query(`ALTER TABLE "product_grade" DROP CONSTRAINT "FK_ed279cf7798d3345643be600567"`);
        await queryRunner.query(`ALTER TABLE "role_discount" DROP CONSTRAINT "FK_a69dad1a9445e23f892cbffaadf"`);
        await queryRunner.query(`ALTER TABLE "order_product" ALTER COLUMN "productId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client" ALTER COLUMN "roleId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_596dadf4ff5b01bd50869c57993" FOREIGN KEY ("roleId") REFERENCES "client_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_grade" ALTER COLUMN "productId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_discount" ALTER COLUMN "roleId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_discount" ADD CONSTRAINT "FK_a69dad1a9445e23f892cbffaadf" FOREIGN KEY ("roleId") REFERENCES "client_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_grade" ADD CONSTRAINT "FK_ed279cf7798d3345643be600567" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_grade" ADD CONSTRAINT "FK_4d957dd2ce451c778ba4f853af8" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
