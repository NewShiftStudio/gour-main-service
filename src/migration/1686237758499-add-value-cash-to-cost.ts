import { MigrationInterface, QueryRunner } from 'typeorm';

export class addValueCashToCost1686237758499 implements MigrationInterface {
  name = 'addValueCashToCost1686237758499';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "price" ADD COLUMN IF NOT EXISTS "companyByCash" DOUBLE PRECISION`);
    await queryRunner.query(`ALTER TABLE "price" ADD COLUMN IF NOT EXISTS "company" DOUBLE PRECISION`);
    await queryRunner.query(`ALTER TABLE "price" ADD COLUMN IF NOT EXISTS "individual" DOUBLE PRECISION`);
    await queryRunner.query(`update "price" set "individual" = "cheeseCoin"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "price" DROP COLUMN IF EXISTS "companyByCash" `);
    await queryRunner.query(`ALTER TABLE "price" DROP COLUMN IF EXISTS "company"`);
    await queryRunner.query(`ALTER TABLE "price" DROP COLUMN IF EXISTS "individual"`);
  }
}
