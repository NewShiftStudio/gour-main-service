import {MigrationInterface, QueryRunner} from "typeorm";

export class cityDeviveryCost1673263324512 implements MigrationInterface {
    name = 'cityDeviveryCost1673263324512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "city" ADD "deliveryCost" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "city" DROP COLUMN "deliveryCost"`);
    }

}
