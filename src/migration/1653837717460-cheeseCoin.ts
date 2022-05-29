import { MigrationInterface, QueryRunner } from 'typeorm';

export class cheeseCoin1653837717460 implements MigrationInterface {
  name = 'cheeseCoin1653837717460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "price" RENAME COLUMN "rub" TO "cheeseCoin"`,
    );
    await queryRunner.query(`ALTER TABLE "price" DROP COLUMN "eur"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "price" ADD "eur" double precision NOT NULL`,
    );
    await queryRunner.query(
      `\`ALTER TABLE "price" RENAME COLUMN "cheeseCoin" TO "rub"`,
    );
  }
}
