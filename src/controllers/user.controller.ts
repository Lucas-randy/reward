import { Request, Response } from 'express';

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

// Simuler une "base de données" en mémoire (exemple)
const users: User[] = [];

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and registration
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: client@example.com
 *               name:
 *                 type: string
 *                 description: User's name (optional)
 *                 example: Randy
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "646931"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: client@example.com
 *                     name:
 *                       type: string
 *                       example: Randy
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-10T11:54:43.908Z"
 *       400:
 *         description: Email is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email is required
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User already exists
 */

export const registerUser = (req: Request, res: Response) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const newUser: User = {
    id: (Math.random() * 1000000).toFixed(0),
    email,
    name,
    createdAt: new Date(),
  };

  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully', user: newUser });
};
