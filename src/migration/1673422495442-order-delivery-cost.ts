import {MigrationInterface, QueryRunner} from "typeorm";

export class orderDeliveryCost1673422495442 implements MigrationInterface {
    name = 'orderDeliveryCost1673422495442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "orderDeliveryCost" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderDeliveryCost"`);
    }

}
