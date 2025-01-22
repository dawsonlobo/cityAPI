import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IState extends Document {
  _id: number;
  name: string;
  population: number;
  capital: string;
  gdp: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const stateSchema = new Schema<IState>({
  _id: { type: Number, required: true },
  name: { type: String, required: true, unique: true },
  population: { type: Number, required: true },
  capital: { type: String, required: true },
  gdp: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export const State: Model<IState> = mongoose.model<IState>('states', stateSchema);
