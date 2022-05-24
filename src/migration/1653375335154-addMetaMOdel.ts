import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMetaMOdel1653375335154 implements MigrationInterface {
  name = 'addMetaMOdel1653375335154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meta" DROP CONSTRAINT "PK_c4c17a6c2bd7651338b60fc590b"`,
    );
    await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "meta" ADD CONSTRAINT "PK_7f87cee620b4cb5946a0d9595d4" PRIMARY KEY ("key")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meta" DROP CONSTRAINT "PK_7f87cee620b4cb5946a0d9595d4"`,
    );
    await queryRunner.query(`ALTER TABLE "meta" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "meta" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "meta" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "meta" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "meta" ADD CONSTRAINT "PK_c4c17a6c2bd7651338b60fc590b" PRIMARY KEY ("id")`,
    );
  }
}
