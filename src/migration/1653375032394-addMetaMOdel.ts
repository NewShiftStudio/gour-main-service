import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMetaMOdel1653375032394 implements MigrationInterface {
  name = 'addMetaMOdel1653375032394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."meta_type_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "meta" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "key" character varying NOT NULL, "value" character varying NOT NULL, "type" "public"."meta_type_enum" NOT NULL, CONSTRAINT "PK_c4c17a6c2bd7651338b60fc590b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "meta"`);
    await queryRunner.query(`DROP TYPE "public"."meta_type_enum"`);
  }
}
