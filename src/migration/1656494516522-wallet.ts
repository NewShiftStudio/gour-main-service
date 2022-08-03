import { MigrationInterface, QueryRunner } from 'typeorm';

export class wallet1656494516522 implements MigrationInterface {
  name = 'wallet1656494516522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_transaction_type_enum" AS ENUM('income', 'expense')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_transaction_status_enum" AS ENUM('init', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet_transaction" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."wallet_transaction_type_enum" NOT NULL, "status" "public"."wallet_transaction_status_enum" NOT NULL, "secretToken" character varying NOT NULL, "prevValue" integer NOT NULL, "newValue" integer NOT NULL, "description" text NOT NULL, "signature" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "walletUuid" uuid, CONSTRAINT "PK_2edf24640f2e1dc331977104ef4" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(`ALTER TABLE "client" ADD "walletUuid" uuid`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_a6d377be9382dd96764f4edd0b9" UNIQUE ("walletUuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_transaction" ADD CONSTRAINT "FK_e47a5f26f2afee3d2cd0f938968" FOREIGN KEY ("walletUuid") REFERENCES "wallet"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_a6d377be9382dd96764f4edd0b9" FOREIGN KEY ("walletUuid") REFERENCES "wallet"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_a6d377be9382dd96764f4edd0b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_transaction" DROP CONSTRAINT "FK_e47a5f26f2afee3d2cd0f938968"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_a6d377be9382dd96764f4edd0b9"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "walletUuid"`);
    await queryRunner.query(`DROP TABLE "wallet_transaction"`);
    await queryRunner.query(
      `DROP TYPE "public"."wallet_transaction_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."wallet_transaction_type_enum"`,
    );
  }
}
