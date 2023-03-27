import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductMigration1679747919850 implements MigrationInterface {
    name = 'CreateProductMigration1679747919850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "price" jsonb NOT NULL, "image" character varying, "attributes" jsonb, "status" character varying NOT NULL, "submittedBy" character varying, "approvedBy" character varying, "rejectedBy" character varying, "rejectionReason" character varying, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
