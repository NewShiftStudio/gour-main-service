import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsWeighedToProduct1686237758498 implements MigrationInterface {
  name = 'addIsWeighedToProduct1686237758498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "isWeighed" bool DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "isWeighed"`);
  }
}
