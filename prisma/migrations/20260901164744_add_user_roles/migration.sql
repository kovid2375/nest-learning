-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';
