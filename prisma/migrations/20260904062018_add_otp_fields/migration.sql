-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpExpires" TIMESTAMP(3),
ADD COLUMN     "otpHash" TEXT;
