import axios from "axios";
import { BITNOB_API_KEY, BITNOB_BASE_URL } from "../utils/config";

/**
 * Envoie une récompense en BTC via Bitnob
 * @param btcAddress Adresse Bitcoin (testnet ou mainnet selon config Bitnob)
 * @param usdcAmount Montant en USDC à convertir en BTC
 */
export const sendBTCReward = async (
  btcAddress: string,
  usdcAmount: number,
  customerEmail: string // ajoute ce paramètre
): Promise<any> => {
  try {
    const BTC_RATE = 0.000025;
    const btcAmount = parseFloat((usdcAmount * BTC_RATE).toFixed(8));
    const satoshis = Math.floor(btcAmount * 1e8);

    const payload = {
      satoshis,
      address: btcAddress,
      customerEmail,
      description: "Reward for USDC purchase",
      priorityLevel: "regular",
    };

    const headers = {
      Authorization: `Bearer ${BITNOB_API_KEY}`,
      "Content-Type": "application/json",
    };

const response = await axios.post(`${BITNOB_BASE_URL}/send_bitcoin`, payload, { headers });

    return response.data;
  } catch (error: any) {
    console.error("❌ Bitnob API Error:", error.response?.data || error.message);
    throw new Error("Failed to send BTC reward via Bitnob");
  }
};
