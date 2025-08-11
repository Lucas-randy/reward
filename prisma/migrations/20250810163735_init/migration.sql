-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "solanaTxId" TEXT NOT NULL,
    "merchantSolanaAddress" TEXT NOT NULL,
    "merchantBTCAddress" TEXT NOT NULL,
    "usdcAmount" DOUBLE PRECISION NOT NULL,
    "vkaAmount" DOUBLE PRECISION NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "btcRewardStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
