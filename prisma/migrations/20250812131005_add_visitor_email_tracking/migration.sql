-- DropIndex
DROP INDEX "public"."FormVisit_formId_visitorIp_visitedAt_idx";

-- AlterTable
ALTER TABLE "public"."FormVisit" ADD COLUMN     "visitorEmail" TEXT;

-- CreateIndex
CREATE INDEX "FormVisit_formId_visitorIp_visitorEmail_visitedAt_idx" ON "public"."FormVisit"("formId", "visitorIp", "visitorEmail", "visitedAt");
