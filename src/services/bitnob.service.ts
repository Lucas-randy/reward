import axios from "axios";
import { BITNOB_API_KEY, BITNOB_BASE_URL } from "../utils/config";

// 🔴 Classe personnalisée pour gérer les erreurs Bitnob
export class BitnobError extends Error {
  statusCode: number;
  details: any;

  constructor(message: string, statusCode = 500, details: any = null) {
    super(message);
    this.name = "BitnobError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Convertit un montant USDC en satoshis BTC
 * @param usdcAmount Montant en USDC
 */
const convertUSDCtoSatoshis = (usdcAmount: number): number => {
  const BTC_RATE = 0.000025; // ⚠️ À remplacer plus tard par un vrai taux via API d’exchange
  const btcAmount = parseFloat((usdcAmount * BTC_RATE).toFixed(8));
  return Math.floor(btcAmount * 1e8); // conversion en satoshis
};

// 🔹 Get Wallets
export const getWallets = async (): Promise<any> => {
  try {
    const headers = {
      Authorization: `Bearer ${BITNOB_API_KEY}`,
      accept: "application/json",
    };

    const response = await axios.get(`${BITNOB_BASE_URL}/wallets`, { headers });
    return response.data;
  } catch (error: any) {
    console.error("❌ Bitnob API Error (getWallets):", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw new BitnobError(
      "Failed to fetch Bitnob wallets",
      error.response?.status || 500,
      error.response?.data || error.message
    );
  }
};

/**
 * Envoie une récompense en BTC via Bitnob
 * @param btcAddress Adresse Bitcoin (testnet ou mainnet selon config Bitnob)
 * @param usdcAmount Montant en USDC à convertir en BTC
 * @param customerEmail Email du client
 */
export const sendBTCReward = async (
  btcAddress: string,
  usdcAmount: number,
  customerEmail: string
): Promise<any> => {
  try {
    const satoshis = convertUSDCtoSatoshis(usdcAmount);

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

    const response = await axios.post(
      `${BITNOB_BASE_URL}/send_bitcoin`,
      payload,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Bitnob API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw new BitnobError(
      "Échec de l'envoi de la récompense BTC via Bitnob, car vous n'avez pas assez de fonds. S'il vous plaît, rechargez votre compte Bitnob !",
      error.response?.status || 500,
      error.response?.data || error.message
    );
  }
};
