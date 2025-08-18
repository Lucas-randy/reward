import { Router } from 'express';
import { getBitnobTransactions } from '../controllers/transaction.controller';
import { getAllTransactions } from '../controllers/reward.controller';


const router = Router();

router.get('/transactions', getAllTransactions);

// 🔹 Nouvelle route Bitnob
router.get('/bitnob-transactions', getBitnobTransactions);

export default router;
