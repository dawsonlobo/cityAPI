import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICity extends Document {
  _id: number;
  name: string;
  population: number;
  country: string;
  latitude: number;
  longitude: number;
  isDeleted:boolean;
  createdAt: Date;
  updatedAt: Date;
}

const citySchema = new Schema<ICity>({
  _id: { type: Number, required: true },
  name: { type: String, required: true, unique: true },
  population: { type: Number, required: true },
  country: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  isDeleted: {type: Boolean, default: false}
}, { timestamps: true });

export const City: Model<ICity> = mongoose.model<ICity>('cities', citySchema);