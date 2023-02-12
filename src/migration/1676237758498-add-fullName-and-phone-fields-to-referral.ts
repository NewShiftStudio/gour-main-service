import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFullNameAndPhoneFieldsToReferral1676237758498 implements MigrationInterface {
  name = 'addFullNameAndPhoneFieldsToReferral1676237758498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "referral_code" ADD "fullName" character varying DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "referral_code" ADD "phone" character varying DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "referral_code" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "referral_code" DROP COLUMN "fullName"`);
  }
}
