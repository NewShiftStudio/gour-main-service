import { MigrationInterface, QueryRunner } from 'typeorm';

export class cascade1659704707628 implements MigrationInterface {
  name = 'cascade1659704707628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meta" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "meta" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "meta" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "createdAt"`);
  }
}
