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