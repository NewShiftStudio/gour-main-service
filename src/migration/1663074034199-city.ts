import {MigrationInterface, QueryRunner} from "typeorm";

export class city1663074034199 implements MigrationInterface {
    name = 'city1663074034199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_7eb2f065d88ba8ad74d65f898f1"`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_7eb2f065d88ba8ad74d65f898f1" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_7eb2f065d88ba8ad74d65f898f1"`);
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "FK_7eb2f065d88ba8ad74d65f898f1" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
