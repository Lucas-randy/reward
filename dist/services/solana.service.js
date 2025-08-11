"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySolanaTransaction = void 0;
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("../utils/config");
const verifySolanaTransaction = async (txId, merchantAddress, vkaAmount) => {
    const connection = new web3_js_1.Connection(config_1.SOLANA_RPC_URL, 'confirmed');
    try {
        const tx = await connection.getTransaction(txId);
        if (!tx)
            return false;
        // Vérification simple : le destinataire et le montant
        const merchantPubKey = new web3_js_1.PublicKey(merchantAddress);
        const found = tx.transaction.message.accountKeys.some((key) => key.equals(merchantPubKey));
        // Ici, tu pourrais vérifier le montant transféré (à adapter selon le token VKA)
        return found;
    }
    catch (err) {
        return false;
    }
};
exports.verifySolanaTransaction = verifySolanaTransaction;
