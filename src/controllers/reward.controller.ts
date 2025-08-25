import { Request, Response } from 'express';
import { verifySolanaTransaction } from '../services/solana.service';
import { sendBTCReward } from '../services/bitnob.service';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/reward:
 *   post:
 *     summary: Send BTC reward based on merchant BTC wallet and amount only
 *     tags: [Reward]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - merchantBTCAddress
 *               - amount
 *             properties:
 *               merchantBTCAddress:
 *                 type: string
 *                 description: The Bitcoin wallet address of the client (merchant BTC wallet)
 *               amount:
 *                 type: number
 *                 description: Amount in VKA tokens spent
 *     responses:
 *       200:
 *         description: Reward sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 solanaTxId:
 *                   type: string
 *                 merchantSolanaAddress:
 *                   type: string
 *                 btcReward:
 *                   type: object
 *                   description: Details of the BTC reward transaction
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing or invalid parameters / Invalid Solana transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */

/*
Commande pour tester l'endpoint:

{
  "solanaTxId": "V5UKFgResGC8GziJgQRPXC4cNRCkXz2t5Sn2zzrcSd2cfByhu12AqHr22Z5okptPqtaFCuAaPkqnFxJNuaxEjeZ",
  "merchantSolanaAddress": "BhWziEv1nRgqQVruPZzv3DCnDiPcx72mPjvWnxq1nqwh",
  "merchantBTCAddress": "tb1q9h0yjdupyfpxfjg24rpx755xrplvzd9hz2nj7v",
  "amount": 2,
  "customerEmail": "client@example.com"
}


*/



interface Transaction {
  id: string;
  solanaTxId: string;
  merchantSolanaAddress?: string;
  merchantBTCAddress: string;
  usdcAmount: number;
  vkaAmount: number;
  customerEmail?: string;
  btcRewardStatus: string; 
  createdAt: Date;
}

// "Base de données" en mémoire des transactions
const transactions: Transaction[] = [];

export const handleReward = async (req: Request, res: Response) => {
  const {
    solanaTxId,
    merchantSolanaAddress,
    merchantBTCAddress,
    amount, // VKA amount
    customerEmail,
  } = req.body;

  // Validation stricte mais claire
  if (
    !solanaTxId ||
    !merchantSolanaAddress ||
    !merchantBTCAddress ||
    (amount === undefined || amount === null || isNaN(amount)) ||
    !customerEmail
  ) {
    return res.status(400).json({ error: "❌ Missing or invalid parameters" });
  }

  try {
    // Vérification transaction Solana
    const isValid = await verifySolanaTransaction(
      solanaTxId,
      merchantSolanaAddress,
      amount
    );

    if (!isValid) {
      return res.status(400).json({ error: "❌ Invalid Solana transaction" });
    }

    // Conversion VKA -> USDC
    const VKA_TO_USD_RATE = 173.02;
    const usdcAmount = amount * VKA_TO_USD_RATE;

    // Calcul récompense BTC (1%)
    const btcRewardAmount = usdcAmount * 0.01;

    // Envoi récompense via Bitnob
    let btcReward;
    try {
      btcReward = await sendBTCReward(
        merchantBTCAddress,
        btcRewardAmount,
        customerEmail
      );
    } catch (bitnobErr: any) {
      return res.status(502).json({
        error: "❌ Failed to send BTC reward via Bitnob",
        details: bitnobErr.message || bitnobErr,
      });
    }

    // Sauvegarde transaction en base
    const newTransaction = await prisma.transaction.create({
      data: {
        id: uuidv4(),
        solanaTxId,
        merchantSolanaAddress,
        merchantBTCAddress,
        usdcAmount,
        vkaAmount: amount,
        customerEmail,
        btcRewardStatus:
          btcReward?.status === "success"
            ? "success"
            : btcReward?.status === "failed"
            ? "failed"
            : "pending",
      },
    });

    return res.json({
      message: `✅ BTC reward sent to merchant wallet: ${merchantBTCAddress}`,
      transaction: newTransaction,
      btcReward,
    });
  } catch (err: any) {
    console.error("❌ handleReward Error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message || err,
    });
  }
};




/**
 * @swagger
 * /api/reward/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Reward]
 *     responses:
 *       200:
 *         description: List of all reward transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   solanaTxId:
 *                     type: string
 *                   merchantSolanaAddress:
 *                     type: string
 *                   merchantBTCAddress:
 *                     type: string
 *                   usdcAmount:
 *                     type: number
 *                   Amount:
 *                     type: number
 *                   customerEmail:
 *                     type: string
 *                   btcReward:
 *                     type: object
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message || err });
  }
};
