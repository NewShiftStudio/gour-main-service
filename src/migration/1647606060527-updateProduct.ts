import {MigrationInterface, QueryRunner} from "typeorm";

export class updateProduct1647606060527 implements MigrationInterface {
    name = 'updateProduct1647606060527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_db47ed0e78b3c6c483607209852"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "moyskladCode"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP COLUMN "cost"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP COLUMN "productPieceId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "moyskladId" character varying`);
        await queryRunner.query(`ALTER TABLE "product" ADD "isWeightGood" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product" ADD "weight" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "amount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD "weight" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_product" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isWeightGood"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "moyskladId"`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD "productPieceId" integer`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD "cost" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "moyskladCode" integer`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_db47ed0e78b3c6c483607209852" FOREIGN KEY ("productPieceId") REFERENCES "product_modification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
