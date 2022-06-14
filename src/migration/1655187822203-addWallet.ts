import {MigrationInterface, QueryRunner} from "typeorm";

export class addWallet1655187822203 implements MigrationInterface {
    name = 'addWallet1655187822203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."wallet_change_type_enum" AS ENUM('income', 'expense')`);
        await queryRunner.query(`ALTER TABLE "wallet_change" ADD "type" "public"."wallet_change_type_enum" NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_change_status_enum" AS ENUM('init', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "wallet_change" ADD "status" "public"."wallet_change_status_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet_change" ADD "secretToken" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet_change" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet_change" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_change" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "wallet_change" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "wallet_change" DROP COLUMN "secretToken"`);
        await queryRunner.query(`ALTER TABLE "wallet_change" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_change_status_enum"`);
        await queryRunner.query(`ALTER TABLE "wallet_change" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_change_type_enum"`);
    }

}
