import express from 'express';
import dotenv from 'dotenv';
import rewardRoutes from './routes/reward.routes';
import userRoutes from './routes/user.routes'; 
import transactionRoutes from './routes/transaction.route';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const app = express();
app.use(express.json());

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reward API',
      version: '1.0.0',
      description: 'API to verify Solana purchases and send BTC rewards via Bitnob',
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // où chercher les annotations Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes API
app.use('/api/reward', rewardRoutes); // inclut POST / et GET /transactions
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
