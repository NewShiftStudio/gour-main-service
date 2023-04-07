import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsByCashOrder1686237758599 implements MigrationInterface {
  name = 'addIsByCashOrder1686237758599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "isByCash" BOOLEAN DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN IF EXISTS "isByCash" `);
  }
}
