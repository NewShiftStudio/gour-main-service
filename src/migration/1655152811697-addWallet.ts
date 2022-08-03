import { MigrationInterface, QueryRunner } from 'typeorm';

export class addWallet1655152811697 implements MigrationInterface {
  name = 'addWallet1655152811697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wallet" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" integer NOT NULL, "signature" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "clientId" integer, CONSTRAINT "REL_ffd77d29122e631ffd7be89a5c" UNIQUE ("clientId"), CONSTRAINT "PK_ac5b822bf9c91fe42b32f804c2f" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet_change" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "prevValue" integer NOT NULL, "newValue" integer NOT NULL, "signature" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "walletUuid" uuid, CONSTRAINT "PK_b07dfee778347c2b0cf5c8785c7" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "leadId"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_ffd77d29122e631ffd7be89a5cf" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_change" ADD CONSTRAINT "FK_02b958d904cc46a9b0c92ed9f14" FOREIGN KEY ("walletUuid") REFERENCES "wallet"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet_change" DROP CONSTRAINT "FK_02b958d904cc46a9b0c92ed9f14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_ffd77d29122e631ffd7be89a5cf"`,
    );
    await queryRunner.query(`ALTER TABLE "order" ADD "leadId" integer`);
    await queryRunner.query(`DROP TABLE "wallet_change"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
  }
}
