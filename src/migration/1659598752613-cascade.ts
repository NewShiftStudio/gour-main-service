import { MigrationInterface, QueryRunner } from 'typeorm';

export class cascade1659598752613 implements MigrationInterface {
  name = 'cascade1659598752613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "discount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "order" ADD "leadId" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "leadId"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "discount"`);
  }
}
