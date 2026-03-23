-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'COMPLETED');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "status" "Status" DEFAULT 'ACTIVE';
