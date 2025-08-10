/*
  Warnings:

  - You are about to drop the column `name` on the `Form` table. All the data in the column will be lost.
  - Made the column `content` on table `Form` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Form" DROP COLUMN "name",
ADD COLUMN     "primaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
ADD COLUMN     "submissionMessage" TEXT NOT NULL DEFAULT 'Form submitted successfully!',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'My Form',
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DEFAULT '{"steps":[{"id":"","stepTitle":"First Step","components":[]}],"currentStepIndex":0,"formData":{}}';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phone" TEXT;
