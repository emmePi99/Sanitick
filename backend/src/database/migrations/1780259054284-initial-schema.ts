import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780259054284 implements MigrationInterface {
    name = 'InitialSchema1780259054284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('patient', 'doctor', 'admin', 'superadmin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "fiscalCode" character varying(16) NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'patient', "isActive" boolean NOT NULL DEFAULT false, "activationToken" character varying, "activationTokenExpires" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_0f1111fd280c31a097b87727a5b" UNIQUE ("fiscalCode"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."booking_status_enum" AS ENUM('pending', 'confirmed', 'cancelled', 'completed')`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "patient_id" uuid NOT NULL, "doctor_id" uuid NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "status" "public"."booking_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "XCL_71ff147247be6cd0d64aa9b2c9" EXCLUDE USING gist ("doctor_id" WITH =, tsrange("startTime", "endTime") WITH &&), CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doctor_schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "dayOfWeek" integer NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "doctorId" uuid, CONSTRAINT "PK_d62f5f6abeb14328ea2ad19a54a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."doctor_specialization_enum" AS ENUM('CARDIOLOGY', 'DERMATOLOGY', 'ENDOCRINOLOGY', 'GASTROENTEROLOGY', 'GENERAL_PRACTICE', 'NEUROLOGY', 'ONCOLOGY', 'ORTHOPEDICS', 'PEDIATRICS', 'PSYCHIATRY', 'RADIOLOGY', 'SURGERY')`);
        await queryRunner.query(`CREATE TABLE "doctor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "specialization" "public"."doctor_specialization_enum" NOT NULL DEFAULT 'GENERAL_PRACTICE', "registrationNumber" character varying NOT NULL, "clinicAddress" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_dbdf54335f20e2019016e0fa0ef" UNIQUE ("registrationNumber"), CONSTRAINT "REL_a685e79dc974f768c39e5d1228" UNIQUE ("user_id"), CONSTRAINT "PK_ee6bf6c8de78803212c548fcb94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_5c1825ada521411411598e2f951" FOREIGN KEY ("patient_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_2b38a44281c26f9114540dce6f0" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor_schedule" ADD CONSTRAINT "FK_d3dff35a2653acdd68e9db631e7" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD CONSTRAINT "FK_a685e79dc974f768c39e5d12281" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor" DROP CONSTRAINT "FK_a685e79dc974f768c39e5d12281"`);
        await queryRunner.query(`ALTER TABLE "doctor_schedule" DROP CONSTRAINT "FK_d3dff35a2653acdd68e9db631e7"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_2b38a44281c26f9114540dce6f0"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_5c1825ada521411411598e2f951"`);
        await queryRunner.query(`DROP TABLE "doctor"`);
        await queryRunner.query(`DROP TYPE "public"."doctor_specialization_enum"`);
        await queryRunner.query(`DROP TABLE "doctor_schedule"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TYPE "public"."booking_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
