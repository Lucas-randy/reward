import axios from "axios";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";

const BITNOB_API_URL = "https://sandboxapi.bitnob.co/api/v1/wallets";
const BITNOB_API_KEY = process.env.BITNOB_API_KEY || "";
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const USDC_MINT = new PublicKey(
  process.env.USDC_MINT || "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);

const connection = new Connection(SOLANA_RPC_URL, "confirmed");

interface BitnobWalletResponse {
  data: {
    balance: number;
    [key: string]: any;
  };
}

export class BalanceService {
  /**
   * Solde BTC depuis Bitnob
   */
  static async getBTCBalance(): Promise<number> {
    try {
      const response = await axios.get<BitnobWalletResponse>(BITNOB_API_URL, {
        headers: { Authorization: `Bearer ${BITNOB_API_KEY}` },
      });

      const balance = response.data?.data?.balance;
      if (balance === undefined) {
        throw new Error("Réponse Bitnob invalide");
      }

      return balance;
    } catch (error: any) {
      console.error("❌ Erreur récupération solde BTC:", error.message || error);
      throw new Error("Impossible de récupérer le solde BTC depuis Bitnob");
    }
  }

  /**
   * Solde USDC sur Solana
   */
  static async getUSDCBalance(publicKey: string): Promise<number> {
    try {
      const owner = new PublicKey(publicKey);
      const ata = await getAssociatedTokenAddress(USDC_MINT, owner);
      const accountInfo = await connection.getTokenAccountBalance(ata);

      return parseFloat(accountInfo.value.amount) / Math.pow(10, accountInfo.value.decimals);
    } catch (error: any) {
      console.error("❌ Erreur récupération solde USDC:", error.message || error);
      throw new Error("Impossible de récupérer le solde USDC sur Solana");
    }
  }
}
