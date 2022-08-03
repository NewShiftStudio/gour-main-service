import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCategoryKey1649672893829 implements MigrationInterface {
  name = 'addCategoryKey1649672893829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ADD "key" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "key"`);
  }
}
