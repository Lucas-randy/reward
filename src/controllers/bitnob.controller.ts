import { Request, Response } from "express";
import { getWallets, sendBTCReward } from "../services/bitnob.service";

/**
 * @swagger
 * tags:
 *   name: Bitnob
 *   description: Endpoints for interacting with Bitnob API
 */

/**
 * @swagger
 * /api/bitnob/wallets:
 *   get:
 *     summary: Retrieve all Bitnob wallets
 *     tags: [Bitnob]
 *     responses:
 *       200:
 *         description: Wallets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Wallet ID
 *                   balance:
 *                     type: number
 *                     description: Wallet balance
 *                   currency:
 *                     type: string
 *                     description: Wallet currency (e.g. BTC, USDT)
 *       500:
 *         description: Failed to retrieve wallets
 */
export const fetchWallets = async (req: Request, res: Response) => {
  try {
    const wallets = await getWallets();
    res.json(wallets);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      error: error.message,
      details: error.details,
    });
  }
};