import { MigrationInterface, QueryRunner } from 'typeorm';

export class cheeseCoin21653838337512 implements MigrationInterface {
  name = 'cheeseCoin21653838337512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role_discount" DROP COLUMN "rub"`);
    await queryRunner.query(`ALTER TABLE "role_discount" DROP COLUMN "eur"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_discount" ADD "eur" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_discount" ADD "rub" double precision`,
    );
  }
}
