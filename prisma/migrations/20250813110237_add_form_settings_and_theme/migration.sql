-- AlterTable
ALTER TABLE "public"."Form" ADD COLUMN     "allowAnonymous" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "allowDuplicates" BOOLEAN NOT NULL DEFAULT true;
