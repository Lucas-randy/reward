import { Request, Response } from "express";
import { BalanceService } from "../services/balance.service";

export const getBalances = async (req: Request, res: Response) => {
  try {
    const btcBalance = await BalanceService.getBTCBalance();

    // ⚠️ Adresse token USDC sur Solana (token account de ton projet devnet)
    const USDC_TOKEN_ACCOUNT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; 
    const usdcBalance = await BalanceService.getUSDCBalance(USDC_TOKEN_ACCOUNT);

    res.json({
      btc: btcBalance,
      usdc: usdcBalance,
    });
  } catch (err: any) {
    console.error("❌ Erreur dans getBalances:", err);
    res.status(500).json({ error: "❌ Failed to fetch balances", details: err.message || err });
  }
};
