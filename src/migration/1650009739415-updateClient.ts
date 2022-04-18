import {MigrationInterface, QueryRunner} from "typeorm";

export class updateClient1650009739415 implements MigrationInterface {
    name = 'updateClient1650009739415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_802c14334992c11bd47014cdff"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "apiUserUuid"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "cityId" integer`);
        await queryRunner.query(`ALTER TABLE "client" ADD "referralCode" character varying`);
        await queryRunner.query(`ALTER TABLE "client" ADD "password" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "role_discount" DROP CONSTRAINT "FK_a69dad1a9445e23f892cbffaadf"`);
        await queryRunner.query(`ALTER TABLE "role_discount" ALTER COLUMN "roleId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_discount" ADD CONSTRAINT "FK_a69dad1a9445e23f892cbffaadf" FOREIGN KEY ("roleId") REFERENCES "client_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_7eb2f065d88ba8ad74d65f898f1" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_7eb2f065d88ba8ad74d65f898f1"`);
        await queryRunner.query(`ALTER TABLE "role_discount" DROP CONSTRAINT "FK_a69dad1a9445e23f892cbffaadf"`);
        await queryRunner.query(`ALTER TABLE "role_discount" ALTER COLUMN "roleId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_discount" ADD CONSTRAINT "FK_a69dad1a9445e23f892cbffaadf" FOREIGN KEY ("roleId") REFERENCES "client_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "referralCode"`);
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "cityId"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "apiUserUuid" uuid NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_802c14334992c11bd47014cdff" ON "client" ("apiUserUuid") `);
    }

}
