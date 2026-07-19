-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "lastClaimAt" TIMESTAMP(3),
ADD COLUMN     "level10UnlockedAt" TIMESTAMP(3),
ADD COLUMN     "loginStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "neonModeEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pendingLevelUp" JSONB,
ADD COLUMN     "profileBonusClaimed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specialBadges" TEXT[] DEFAULT ARRAY[]::TEXT[];
