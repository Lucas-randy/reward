import { Router } from "express";
import { BalanceService } from "../services/balance.service";

const router = Router();

/**
 * GET /api/balance/:publicKey
 * Retourne solde BTC (Bitnob) + USDC (Solana)
 */
router.get("/:publicKey", async (req, res) => {
  try {
    const { publicKey } = req.params;

    const btcBalance = await BalanceService.getBTCBalance();
    const usdcBalance = await BalanceService.getUSDCBalance(publicKey);

    res.json({ btc: btcBalance, usdc: usdcBalance });
  } catch (error : any) {
    res.status(500).json({
      error: "❌ Failed to fetch balances",
      details: error.message,
    });
  }
});

export default router;
