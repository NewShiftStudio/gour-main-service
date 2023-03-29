import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIntegerIdFieldToOrder2676237758498 implements MigrationInterface {
  name = 'addIntegerIdFieldToOrder2676237758498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" ADD COLUMN "idInt" SERIAL;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "idInt"`);
  }
}
