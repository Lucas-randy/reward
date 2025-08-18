import axios from 'axios';
import { Request, Response } from 'express';

/**
 * @swagger
 * /api/transactions/bitnob-transactions:
 *   get:
 *     summary: Get transactions from Bitnob wallet (sandbox)
 *     tags: [Reward]
 *     responses:
 *       200:
 *         description: List of transactions fetched from Bitnob
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */


interface BitnobTransaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  reference: string;
  description: string;
  balanceAfter: string;
  amount: string;
  btcAmount: string;
  address: string;
  hash: string;
  type: string;
  status: string;
  // ajoute d'autres champs si nécessaire
}

interface BitnobResponse {
  status: boolean;
  message: string;
  data: {
    transactions: BitnobTransaction[];
  };
}

export const getBitnobTransactions = async (req: Request, res: Response) => {
  try {
    const BITNOB_API_KEY = process.env.BITNOB_API_KEY;
    const response = await axios.get<BitnobResponse>('https://sandboxapi.bitnob.co/api/v1/transactions', {
      headers: {
        Authorization: `Bearer ${BITNOB_API_KEY}`,
        Accept: 'application/json',
      },
    });

    res.json({ transactions: response.data.data.transactions });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Bitnob transactions', details: err.message });
  }
};
