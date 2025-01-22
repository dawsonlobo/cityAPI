import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICounter extends Document {
  name: string;
  cityId: number;
}

const counterSchema = new Schema<ICounter>({
  name: { type: String, required: true },
  cityId: { type: Number, default: 1 },
});

export const Counter: Model<ICounter> = mongoose.model<ICounter>('Counter', counterSchema);