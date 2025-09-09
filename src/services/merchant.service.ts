import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type MerchantSummary = {
  address: string;
  hasTransactions: boolean;
  totals: {
    usdcAmount: number;
    vkaAmount: number;
    count: number;
  };
  statuses: {
    success: number;
    pending: number;
    failed: number;
  };
  lastRewardAt: string | null;
};

export class MerchantService {
  /**
   * Agrège les infos internes (DB) pour une adresse BTC merchant donnée
   */
  static async getSummaryByAddress(address: string): Promise<MerchantSummary> {
    const txs = await prisma.transaction.findMany({
      where: { merchantBTCAddress: address },
      orderBy: { createdAt: "desc" },
    });

    const hasTransactions = txs.length > 0;

    const totals = txs.reduce(
      (acc, tx) => {
        acc.usdcAmount += tx.usdcAmount;
        acc.vkaAmount += tx.vkaAmount;
        acc.count += 1;
        return acc;
      },
      { usdcAmount: 0, vkaAmount: 0, count: 0 }
    );

    const statuses = txs.reduce(
      (acc, tx) => {
        const s = (tx.btcRewardStatus || "").toLowerCase();
        if (s === "success") acc.success += 1;
        else if (s === "failed") acc.failed += 1;
        else acc.pending += 1;
        return acc;
      },
      { success: 0, pending: 0, failed: 0 }
    );

    const lastRewardAt = hasTransactions ? txs[0].createdAt.toISOString() : null;

    return {
      address,
      hasTransactions,
      totals,
      statuses,
      lastRewardAt,
    };
  }
}
