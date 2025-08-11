"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReward = void 0;
const solana_service_1 = require("../services/solana.service");
const usdc_service_1 = require("../services/usdc.service");
const bitnob_service_1 = require("../services/bitnob.service");
const handleReward = async (req, res) => {
    const { solanaTxId, merchantSolanaAddress, merchantBTCAddress, usdcAmount, vkaAmount } = req.body;
    try {
        // 1. Vérifier la transaction Solana
        const isValid = await (0, solana_service_1.verifySolanaTransaction)(solanaTxId, merchantSolanaAddress, vkaAmount);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid Solana transaction' });
        }
        // 2. Envoyer USDC au commerçant (mock)
        const usdcTxId = await (0, usdc_service_1.sendUSDC)(merchantSolanaAddress, usdcAmount);
        // 3. Envoyer la récompense BTC via Bitnob
        const btcReward = await (0, bitnob_service_1.sendBTCReward)(merchantBTCAddress, usdcAmount);
        return res.json({
            solanaTxId,
            usdcTxId,
            btcReward,
            message: 'Reward sent successfully!'
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Internal server error', details: err });
    }
};
exports.handleReward = handleReward;
