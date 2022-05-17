import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAvatarInClient1652787280276 implements MigrationInterface {
  name = 'addAvatarInClient1652787280276';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" ADD "avatarId" integer`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_e6810a06b1e242ee7bc7f8a6d73" UNIQUE ("avatarId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_e6810a06b1e242ee7bc7f8a6d73" FOREIGN KEY ("avatarId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_e6810a06b1e242ee7bc7f8a6d73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_e6810a06b1e242ee7bc7f8a6d73"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "avatarId"`);
  }
}
