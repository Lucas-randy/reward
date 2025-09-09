import axios from "axios";

const BITNOB_API_URL = "https://sandboxapi.bitnob.co/api/v1/wallets";
const BITNOB_API_KEY = process.env.BITNOB_API_KEY || "";

export type BitnobWallet = {
  id: string;
  name: string;
  currency: string;   // "btc" | "usd"
  type: string;       // "bitcoin" | "fiat"
  balance: any;       // { sat, btc, usd } côté btc ; { usd } côté usd
  [k: string]: any;
};

type GetWalletsResponse = {
  status: boolean;
  message: string;
  data: BitnobWallet[];
};

export class BitnobCompanyWalletService {
  static async getBitcoinWallet(): Promise<BitnobWallet | null> {
    const resp = await axios.get<GetWalletsResponse>(BITNOB_API_URL, {
      headers: {
        Authorization: `Bearer ${BITNOB_API_KEY}`,
        Accept: "application/json",
      },
    });

    const wallets = resp.data?.data || [];
    const btcWallet =
      wallets.find((w) => w.currency === "btc") ||
      wallets.find((w) => w.type === "bitcoin") ||
      null;

    return btcWallet;
  }
}
