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
// accessTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: parseInt(String(CONFIG.ACCESS_TOKEN_EXPIRY), 10) });  // TTL index

// AccessToken model
const AccessToken = mongoose.model<IAccessToken>('accesstokens', accessTokenSchema);
export default AccessToken;