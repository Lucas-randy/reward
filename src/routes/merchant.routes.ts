import { Router } from "express";
import { getMerchantBalance } from "../controllers/merchant.controller";

const router = Router();

/**
 * GET /api/merchants/:btcAddress/balance
 * Agrégats internes + solde du Bitcoin Wallet Bitnob
 */
router.get("/:btcAddress/balance", getMerchantBalance);

export default router;
