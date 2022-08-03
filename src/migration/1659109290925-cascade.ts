import {MigrationInterface, QueryRunner} from "typeorm";

export class cascade1659109290925 implements MigrationInterface {
    name = 'cascade1659109290925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_grade" DROP CONSTRAINT "FK_4d957dd2ce451c778ba4f853af8"`);
        await queryRunner.query(`ALTER TABLE "product_grade" ALTER COLUMN "productId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_grade" ADD CONSTRAINT "FK_4d957dd2ce451c778ba4f853af8" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_grade" DROP CONSTRAINT "FK_4d957dd2ce451c778ba4f853af8"`);
        await queryRunner.query(`ALTER TABLE "product_grade" ALTER COLUMN "productId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_grade" ADD CONSTRAINT "FK_4d957dd2ce451c778ba4f853af8" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
