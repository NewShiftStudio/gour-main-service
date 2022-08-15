import { MigrationInterface, QueryRunner } from 'typeorm';

export class cascade1660034993614 implements MigrationInterface {
  name = 'cascade1660034993614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "lives" integer NOT NULL DEFAULT '3'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "lives"`);
  }
}
