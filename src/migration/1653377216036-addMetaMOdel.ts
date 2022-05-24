import {MigrationInterface, QueryRunner} from "typeorm";

export class addMetaMOdel1653377216036 implements MigrationInterface {
    name = 'addMetaMOdel1653377216036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "value" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "value" character varying NOT NULL`);
    }

}
