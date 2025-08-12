-- AlterTable
ALTER TABLE "public"."FormResponse" ALTER COLUMN "content" SET DEFAULT '{}';

-- CreateTable
CREATE TABLE "public"."FormVisit" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "visitorIp" TEXT NOT NULL,
    "userAgent" TEXT,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FormVisit_formId_visitorIp_visitedAt_idx" ON "public"."FormVisit"("formId", "visitorIp", "visitedAt");

-- AddForeignKey
ALTER TABLE "public"."FormVisit" ADD CONSTRAINT "FormVisit_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
