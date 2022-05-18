import { MigrationInterface, QueryRunner } from 'typeorm';

export class clientFixes1652863051780 implements MigrationInterface {
  name = 'clientFixes1652863051780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "firstName" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "lastName" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "email" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "firstName"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "name" character varying NOT NULL DEFAULT ''`,
    );
  }
}
