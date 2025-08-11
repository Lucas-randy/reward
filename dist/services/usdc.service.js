"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUSDC = void 0;
// Mock USDC service (à remplacer par une vraie intégration si besoin)
const sendUSDC = async (merchantAddress, amount) => {
    // Simule une transaction USDC sur Solana
    return `mock-usdc-txid-${Date.now()}`;
};
exports.sendUSDC = sendUSDC;
