import {MigrationInterface, QueryRunner} from "typeorm";

export class removeDeliveryType1652445117164 implements MigrationInterface {
    name = 'removeDeliveryType1652445117164'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "deliveryType"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_profile" ADD "deliveryType" character varying NOT NULL`);
    }

}
