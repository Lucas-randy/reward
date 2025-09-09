// transaction.service.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class TransactionService {
  static async markAsSuccess(transactionId: string) {
    return prisma.transaction.update({
      where: { id: transactionId },
      data: { btcRewardStatus: "success" },
    });
  }

  static async markAsFailed(transactionId: string) {
    return prisma.transaction.update({
      where: { id: transactionId },
      data: { btcRewardStatus: "failed" },
    });
  }
}
