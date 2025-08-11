import { Connection, PublicKey, TransactionResponse, VersionedTransactionResponse } from '@solana/web3.js';
import { SOLANA_RPC_URL } from '../utils/config';

export const verifySolanaTransaction = async (
  txId: string,
  merchantAddress: string,
  vkaAmount: number
): Promise<boolean> => {
  const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
  try {
    const tx: TransactionResponse | VersionedTransactionResponse | null = await connection.getTransaction(txId, {
      maxSupportedTransactionVersion: 0,
    });
    if (!tx) {
      console.log("Transaction not found");
      return false;
    }

    let accountKeys;

    if ('message' in tx.transaction && 'accountKeys' in tx.transaction.message) {
      // TransactionResponse classique
      accountKeys = tx.transaction.message.accountKeys;
    } else if ('message' in tx.transaction && 'staticAccountKeys' in tx.transaction.message) {
      // VersionedTransactionResponse
      accountKeys = tx.transaction.message.staticAccountKeys;
    } else {
      console.log("Unknown transaction message format");
      return false;
    }

    console.log("Transaction account keys:");
    accountKeys.forEach((key, i) => {
      console.log(`- [${i}] ${key.toBase58()}`);
    });

    const merchantPubKey = new PublicKey(merchantAddress);
    const found = accountKeys.some(
      (key) => key.equals(merchantPubKey)
    );

    console.log(`Merchant address found in tx: ${found}`);

    // TODO: vérifier vkaAmount ici

    return found;
  } catch (err) {
    console.error("Error verifying transaction:", err);
    return false;
  }
};
