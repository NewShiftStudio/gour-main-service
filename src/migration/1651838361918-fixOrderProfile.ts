import {MigrationInterface, QueryRunner} from "typeorm";

export class fixOrderProfile1651838361918 implements MigrationInterface {
    name = 'fixOrderProfile1651838361918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "order_profile" ADD "street" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_profile" ADD "house" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_profile" ADD "apartment" character varying`);
        await queryRunner.query(`ALTER TABLE "order_profile" ADD "entrance" character varying`);
        await queryRunner.query(`ALTER TABLE "order_profile" ADD "floor" character varying`);
        await queryRunner.query(`ALTER TABLE "order" ADD "firstName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "floor"`);
        await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "entrance"`);
        await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "apartment"`);
        await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "house"`);
        await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "street"`);
        await queryRunner.query(`ALTER TABLE "order_profile" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_profile" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_profile" ADD "phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_profile" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_profile" ADD "firstName" character varying NOT NULL`);
    }

}
