"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOLANA_RPC_URL = exports.BITNOB_BASE_URL = exports.BITNOB_API_KEY = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.BITNOB_API_KEY = process.env.BITNOB_API_KEY || '';
exports.BITNOB_BASE_URL = process.env.BITNOB_BASE_URL || 'https://api.bitnob.co/api/v1';
exports.SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
