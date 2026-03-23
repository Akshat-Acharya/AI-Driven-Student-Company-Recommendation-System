-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "CompanyProfile" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "companySize" "CompanySize",
ADD COLUMN     "foundedYear" INTEGER,
ADD COLUMN     "hiringDomains" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "socialLinks" JSONB,
ADD COLUMN     "website" TEXT;
