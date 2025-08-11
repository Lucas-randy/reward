import { Request, Response } from 'express';
import { verifySolanaTransaction } from '../services/solana.service';
import { sendBTCReward } from '../services/bitnob.service';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



/**
 * @swagger
 * tags:
 *   name: Reward
 *   description: API to process Solana transactions and send BTC rewards
 */

/**
 * @swagger
 * /api/reward:
 *   post:
 *     summary: Verify Solana transaction and send BTC reward
 *     tags: [Reward]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - solanaTxId
 *               - merchantSolanaAddress
 *               - merchantBTCAddress
 *               - usdcAmount
 *               - vkaAmount
 *               - customerEmail
 *             properties:
 *               solanaTxId:
 *                 type: string
 *                 description: The Solana transaction ID to verify
 *               merchantSolanaAddress:
 *                 type: string
 *                 description: The Solana address of the merchant
 *               merchantBTCAddress:
 *                 type: string
 *                 description: The Bitcoin address of the merchant
 *               usdcAmount:
 *                 type: number
 *                 description: Amount in USDC spent
 *               vkaAmount:
 *                 type: number
 *                 description: Amount in VKA tokens spent
 *               customerEmail:
 *                 type: string
 *                 description: Customer email
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


interface Transaction {
  id: string;
  solanaTxId: string;
  merchantSolanaAddress: string;
  merchantBTCAddress: string;
  usdcAmount: number;
  vkaAmount: number;
  customerEmail: string;
  btcRewardStatus: string; 
  createdAt: Date;
}

// "Base de données" en mémoire des transactions
const transactions: Transaction[] = [];

export const handleReward = async (req: Request, res: Response) => {
  const { solanaTxId, merchantSolanaAddress, merchantBTCAddress, usdcAmount, vkaAmount, customerEmail } = req.body;

  if (!solanaTxId || !merchantSolanaAddress || !merchantBTCAddress || !usdcAmount || !vkaAmount || !customerEmail) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // 1. Vérifier la transaction Solana
    const isValid = await verifySolanaTransaction(solanaTxId, merchantSolanaAddress, vkaAmount);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid Solana transaction' });
    }

    // 2. (Optionnel) Envoyer USDC au commerçant

    // 3. Envoyer la récompense BTC via Bitnob
    const btcReward = await sendBTCReward(merchantBTCAddress, usdcAmount, customerEmail);

    // 4. Enregistrer dans PostgreSQL
    const newTransaction = await prisma.transaction.create({
      data: {
        id: uuidv4(),
        solanaTxId,
        merchantSolanaAddress,
        merchantBTCAddress,
        usdcAmount,
        vkaAmount,
        customerEmail,
        btcRewardStatus: btcReward?.status ? 'pending' : 'failed',
      },
    });

    return res.json({
      message: 'Reward sent successfully!',
      transaction: newTransaction,
      btcReward,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal server error', details: err.message || err });
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
 *                   vkaAmount:
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
