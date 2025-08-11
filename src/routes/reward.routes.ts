import { Router } from 'express';
import { handleReward, getAllTransactions  } from '../controllers/reward.controller';

const router = Router();

router.post('/', handleReward);
router.get('/transactions', getAllTransactions);

export default router;
