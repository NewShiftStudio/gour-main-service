import {MigrationInterface, QueryRunner} from "typeorm";

export class addReferralCode1650468064995 implements MigrationInterface {
    name = 'addReferralCode1650468064995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" RENAME COLUMN "referralCode" TO "referralCodeId"`);
        await queryRunner.query(`CREATE TABLE "referral_code" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "code" character varying NOT NULL, "discount" integer NOT NULL, CONSTRAINT "PK_669df184f201c602c986bacd804" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "referralCodeId"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "referralCodeId" integer`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`);
        await queryRunner.query(`ALTER TABLE "order_product" ALTER COLUMN "productId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_00581f54a58f23d0a540d522d6a" FOREIGN KEY ("referralCodeId") REFERENCES "referral_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_00581f54a58f23d0a540d522d6a"`);
        await queryRunner.query(`ALTER TABLE "order_product" ALTER COLUMN "productId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "referralCodeId"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "referralCodeId" character varying`);
        await queryRunner.query(`DROP TABLE "referral_code"`);
        await queryRunner.query(`ALTER TABLE "client" RENAME COLUMN "referralCodeId" TO "referralCode"`);
    }

}
