import { Request, Response } from "express";
import { MerchantService } from "../services/merchant.service";
import { BitnobCompanyWalletService } from "../services/bitnob-wallet.service";

/**
 * @swagger
 * /api/merchants/{btcAddress}/balance:
 *   get:
 *     summary: Get merchant balance & summary by BTC address
 *     description: Retourne les agrégats internes (Prisma) pour l'adresse BTC du merchant + le solde du Bitcoin Wallet Bitnob de la compagnie.
 *     tags: [Wallets]
 *     parameters:
 *       - in: path
 *         name: btcAddress
 *         required: true
 *         schema:
 *           type: string
 *         description: "Adresse publique Bitcoin du merchant (ex: tb1q9h0yjd... sur testnet)"
 *     responses:
 *       200:
 *         description: Résumé calculé + solde du wallet Bitnob
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 address:
 *                   type: string
 *                 internal:
 *                   type: object
 *                   properties:
 *                     hasTransactions:
 *                       type: boolean
 *                     totals:
 *                       type: object
 *                       properties:
 *                         usdcAmount:
 *                           type: number
 *                         vkaAmount:
 *                           type: number
 *                         count:
 *                           type: number
 *                     statuses:
 *                       type: object
 *                       properties:
 *                         success:
 *                           type: number
 *                         pending:
 *                           type: number
 *                         failed:
 *                           type: number
 *                     lastRewardAt:
 *                       type: string
 *                       nullable: true
 *                 bitnobCompanyWallet:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     balance:
 *                       type: object
 *                       properties:
 *                         sat:
 *                           type: number
 *                         btc:
 *                           type: number
 *                         usd:
 *                           type: number
 *       500:
 *         description: Internal server error
 */
export const getMerchantBalance = async (req: Request, res: Response) => {
  try {
    const { btcAddress } = req.params;

    // 1) Agrégats internes (DB)
    const summary = await MerchantService.getSummaryByAddress(btcAddress);

    // 2) Solde du wallet BTC Bitnob (company)
    const btcWallet = await BitnobCompanyWalletService.getBitcoinWallet();

    return res.json({
      address: btcAddress,
      internal: summary,
      bitnobCompanyWallet: btcWallet
        ? {
            id: btcWallet.id,
            name: btcWallet.name,
            balance: btcWallet.balance, // { sat, btc, usd }
          }
        : null,
    });
  } catch (err: any) {
    console.error("❌ getMerchantBalanceByAddress error:", err.response?.data || err.message || err);
    return res.status(500).json({
      error: "Failed to build merchant balance summary",
      details: err.response?.data || err.message || String(err),
    });
  }
};