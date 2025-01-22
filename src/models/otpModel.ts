import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
    userId: mongoose.Types.ObjectId;
  phone: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    phone: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } }, // Expires in 5 minutes
  },
  { timestamps: true }
);

export const Otp = mongoose.model<IOtp>('Otp', otpSchema);
