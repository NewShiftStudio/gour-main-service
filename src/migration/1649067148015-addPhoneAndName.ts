import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPhoneAndName1649067148015 implements MigrationInterface {
  name = 'addPhoneAndName1649067148015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD "name" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "phone" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_596dadf4ff5b01bd50869c57993"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "roleId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_596dadf4ff5b01bd50869c57993" FOREIGN KEY ("roleId") REFERENCES "client_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_596dadf4ff5b01bd50869c57993"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "roleId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_596dadf4ff5b01bd50869c57993" FOREIGN KEY ("roleId") REFERENCES "client_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "name"`);
  }
}
