-- AlterTable
ALTER TABLE "InquiryRequest" ADD COLUMN     "equipmentRequest" JSONB,
ADD COLUMN     "organization" TEXT,
ADD COLUMN     "privacyAccepted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "EquipmentItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquipmentItem_pkey" PRIMARY KEY ("id")
);
