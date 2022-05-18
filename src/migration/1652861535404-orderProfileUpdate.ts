import { MigrationInterface, QueryRunner } from 'typeorm';

export class orderProfileUpdate1652861535404 implements MigrationInterface {
  name = 'orderProfileUpdate1652861535404';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_profile" ADD "comment" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "mainOrderProfileId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_f3e010b4df6cd1e01ce41573aeb" UNIQUE ("mainOrderProfileId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_f3e010b4df6cd1e01ce41573aeb" FOREIGN KEY ("mainOrderProfileId") REFERENCES "order_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_f3e010b4df6cd1e01ce41573aeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_f3e010b4df6cd1e01ce41573aeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN "mainOrderProfileId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_profile" DROP COLUMN "comment"`,
    );
  }
}
