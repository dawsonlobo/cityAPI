import mongoose, { Schema, Document } from 'mongoose';

interface ICity extends Document {
  name: string;
  country: string;
  population: number;
  isDeleted:Boolean
}

const citySchema: Schema = new Schema({
  name: { type: String, required: true},
  country: { type: String, required: true },
  population: { type: Number, required: true },
  isDeleted:{type:Boolean,default:false}
},{
    timestamps: true
});

export default mongoose.model<ICity>('City', citySchema);
