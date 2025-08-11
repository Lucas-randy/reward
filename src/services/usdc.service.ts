// Mock USDC service (à remplacer par une vraie intégration si besoin)
export const sendUSDC = async (
  merchantAddress: string,
  amount: number
): Promise<string> => {
  // Simule une transaction USDC sur Solana
  return `mock-usdc-txid-${Date.now()}`;
};
