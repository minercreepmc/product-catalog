import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReviewerRole1680930138166 implements MigrationInterface {
  name = 'AddReviewerRole1680930138166';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reviewer" ADD "role" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reviewer" DROP COLUMN "role"`);
  }
}
