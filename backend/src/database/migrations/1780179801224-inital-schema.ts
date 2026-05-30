import { MigrationInterface, QueryRunner } from "typeorm";

export class InitalSchema1780179801224 implements MigrationInterface {
    name = 'InitalSchema1780179801224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('patient', 'doctor', 'admin', 'superadmin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "fiscalCode" character varying(16) NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'patient', "isActive" boolean NOT NULL DEFAULT false, "activationToken" character varying, "activationTokenExpires" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_0f1111fd280c31a097b87727a5b" UNIQUE ("fiscalCode"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."booking_status_enum" AS ENUM('pending', 'confirmed', 'cancelled', 'completed')`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "status" "public"."booking_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "patientId" uuid, "doctorId" uuid, CONSTRAINT "XCL_22f8f587ba632945270101e1f2" EXCLUDE USING gist ("doctorId" WITH =, tsrange("startTime", "endTime") WITH &&), CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doctor_schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dayOfWeek" integer NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "doctorId" uuid, CONSTRAINT "PK_d62f5f6abeb14328ea2ad19a54a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."doctor_specialization_enum" AS ENUM('CARDIOLOGY', 'DERMATOLOGY', 'ENDOCRINOLOGY', 'GASTROENTEROLOGY', 'GENERAL_PRACTICE', 'NEUROLOGY', 'ONCOLOGY', 'ORTHOPEDICS', 'PEDIATRICS', 'PSYCHIATRY', 'RADIOLOGY', 'SURGERY')`);
        await queryRunner.query(`CREATE TABLE "doctor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "specialization" "public"."doctor_specialization_enum" NOT NULL DEFAULT 'GENERAL_PRACTICE', "registrationNumber" character varying NOT NULL, "clinicAddress" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_dbdf54335f20e2019016e0fa0ef" UNIQUE ("registrationNumber"), CONSTRAINT "REL_e573a17ab8b6eea2b7fe9905fa" UNIQUE ("userId"), CONSTRAINT "PK_ee6bf6c8de78803212c548fcb94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_de2b4572c0e9f7ad3793817a2b3" FOREIGN KEY ("patientId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_59a80a69b9461ad59f15af783f5" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor_schedule" ADD CONSTRAINT "FK_d3dff35a2653acdd68e9db631e7" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD CONSTRAINT "FK_e573a17ab8b6eea2b7fe9905fa8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor" DROP CONSTRAINT "FK_e573a17ab8b6eea2b7fe9905fa8"`);
        await queryRunner.query(`ALTER TABLE "doctor_schedule" DROP CONSTRAINT "FK_d3dff35a2653acdd68e9db631e7"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_59a80a69b9461ad59f15af783f5"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_de2b4572c0e9f7ad3793817a2b3"`);
        await queryRunner.query(`DROP TABLE "doctor"`);
        await queryRunner.query(`DROP TYPE "public"."doctor_specialization_enum"`);
        await queryRunner.query(`DROP TABLE "doctor_schedule"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TYPE "public"."booking_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
