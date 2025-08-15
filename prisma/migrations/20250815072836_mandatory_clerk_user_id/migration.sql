/*
  Warnings:

  - Made the column `clerkUserId` on table `Form` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `clerkUserId` to the `FormResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Form" ALTER COLUMN "clerkUserId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."FormResponse" ADD COLUMN     "clerkUserId" TEXT NOT NULL;
