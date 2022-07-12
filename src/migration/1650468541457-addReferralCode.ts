import { MigrationInterface, QueryRunner } from 'typeorm';

export class addReferralCode1650468541457 implements MigrationInterface {
  name = 'addReferralCode1650468541457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e2228930b1cc8b983445357b1b" ON "referral_code" ("code") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e2228930b1cc8b983445357b1b"`,
    );
  }
}
