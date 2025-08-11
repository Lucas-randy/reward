import dotenv from 'dotenv';
dotenv.config();

export const BITNOB_API_KEY = process.env.BITNOB_API_KEY || '';
export const BITNOB_BASE_URL = process.env.BITNOB_BASE_URL || 'https://api.bitnob.co/api/v1';
export const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
