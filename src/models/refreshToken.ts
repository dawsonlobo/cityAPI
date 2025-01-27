import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';
import { CONFIG } from '../config/config';

dotenv.config();

// Interface for RefreshToken Document
export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  createdAt: Date;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshToken:
 *       type: object
 *       required:
 *         - userId
 *         - token
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the refresh token
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the token
 *         token:
 *           type: string
 *           description: The refresh token string
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the token was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the token details were last updated
 *       example:
 *         _id: "607c2f9b2f2e1a3e589f3e5c"
 *         userId: "605f1f77d9b7b2a3d45b6c77"
 *         token: "abc123xyz456refresh"
 *         createdAt: "2025-01-27T12:00:00Z"
 *         updatedAt: "2025-01-27T12:30:00Z"
 * 
 * /refresh-tokens:
 *   post:
 *     tags: ['Authentication']
 *     summary: Create a new refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshToken'
 *     responses:
 *       201:
 *         description: Successfully created refresh token
 *       400:
 *         description: Invalid input data
 * /refresh-tokens/{id}:
 *   get:
 *     tags: ['Authentication']
 *     summary: Retrieve a refresh token by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the refresh token to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved refresh token
 *       404:
 *         description: Refresh token not found
 *   delete:
 *     tags: ['Authentication']
 *     summary: Delete a refresh token by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the refresh token to delete
 *     responses:
 *       200:
 *         description: Successfully deleted refresh token
 *       404:
 *         description: Refresh token not found
 */

// Schema for RefreshToken
const refreshTokenSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference to User
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Adding expiration for refresh token (365 days = 31536000 seconds)
refreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: parseInt(String(CONFIG.REFRESH_TOKEN_EXPIRY), 10) });  // TTL index

// RefreshToken model
const RefreshToken = mongoose.model<IRefreshToken>('refreshtokens', refreshTokenSchema);
export default RefreshToken;
