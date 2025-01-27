import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';
import { CONFIG } from '../config/config';

dotenv.config();
// Interface for AccessToken Document
export interface IAccessToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  createdAt: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     AccessToken:
 *       type: object
 *       required:
 *         - userId
 *         - token
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the access token
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the token
 *         token:
 *           type: string
 *           description: The access token string
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
 *         token: "abc123xyz456"
 *         createdAt: "2025-01-27T12:00:00Z"
 *         updatedAt: "2025-01-27T12:30:00Z"
 * 
 * /access-tokens:
 *   post:
 *     tags: ['Authentication']
 *     summary: Create a new access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccessToken'
 *     responses:
 *       201:
 *         description: Successfully created access token
 *       400:
 *         description: Invalid input data
 * /access-tokens/{id}:
 *   get:
 *     tags: ['Authentication']
 *     summary: Retrieve an access token by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the access token to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved access token
 *       404:
 *         description: Access token not found
 *   delete:
 *     tags: ['Authentication']
 *     summary: Delete an access token by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the access token to delete
 *     responses:
 *       200:
 *         description: Successfully deleted access token
 *       404:
 *         description: Access token not found
 */

// Schema for AccessToken
const accessTokenSchema: Schema = new Schema(
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

// Adding expiration for access token (10 days = 864000 seconds)
accessTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: parseInt(String(CONFIG.ACCESS_TOKEN_EXPIRY), 10) });  // TTL index

// AccessToken model
const AccessToken = mongoose.model<IAccessToken>('accesstokens', accessTokenSchema);
export default AccessToken;
