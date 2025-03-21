-- CreateTable
CREATE TABLE "OtpConfig" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OtpConfig_applicationId_key" ON "OtpConfig"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "OtpConfig_messageId_key" ON "OtpConfig"("messageId");
