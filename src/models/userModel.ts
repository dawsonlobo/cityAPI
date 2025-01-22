import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document{
    name: string;
    phone: string;
  isDeleted: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, unique: true, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
