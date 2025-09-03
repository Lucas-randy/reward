import { Router } from "express";
import { fetchWallets } from "../controllers/bitnob.controller";

const router = Router();

router.get("/wallets", fetchWallets);
//router.post("/reward", rewardBTC);

export default router;