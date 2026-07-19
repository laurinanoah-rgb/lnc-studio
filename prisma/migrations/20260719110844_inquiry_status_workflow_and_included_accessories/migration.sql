-- AlterEnum
BEGIN;
CREATE TYPE "InquiryStatus_new" AS ENUM ('NEU', 'GENEHMIGT', 'ABGELEHNT');
ALTER TABLE "public"."InquiryRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "InquiryRequest" ALTER COLUMN "status" TYPE "InquiryStatus_new" USING ("status"::text::"InquiryStatus_new");
ALTER TYPE "InquiryStatus" RENAME TO "InquiryStatus_old";
ALTER TYPE "InquiryStatus_new" RENAME TO "InquiryStatus";
DROP TYPE "public"."InquiryStatus_old";
ALTER TABLE "InquiryRequest" ALTER COLUMN "status" SET DEFAULT 'NEU';
COMMIT;

-- AlterTable
ALTER TABLE "EquipmentItem" ADD COLUMN     "condition" TEXT;

-- AlterTable
ALTER TABLE "InquiryRequest" ADD COLUMN     "includedAccessories" JSONB;

-- CreateTable
CREATE TABLE "IncludedAccessory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "IncludedAccessory_pkey" PRIMARY KEY ("id")
);
