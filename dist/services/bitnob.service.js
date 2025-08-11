"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBTCReward = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../utils/config");
const sendBTCReward = async (btcAddress, usdcAmount) => {
    // Conversion USDC -> BTC (mock, à remplacer par un vrai taux)
    const btcAmount = usdcAmount * 0.000025; // exemple de taux
    try {
        const response = await axios_1.default.post(`${config_1.BITNOB_BASE_URL}/send-payment`, {
            amount: btcAmount,
            currency: 'BTC',
            recipient: btcAddress,
            description: 'Reward for USDC purchase',
        }, {
            headers: {
                Authorization: `Bearer ${config_1.BITNOB_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    catch (err) {
        return { error: 'Bitnob API error', details: err };
    }
};
exports.sendBTCReward = sendBTCReward;
