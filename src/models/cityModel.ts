import mongoose, { Schema, Document } from 'mongoose';

interface ICity extends Document {
  name: string;
  country: string;
  stateId: mongoose.Types.ObjectId;
  population: number;
  isDeleted:Boolean
}

const citySchema: Schema = new Schema({
  name: { type: String, required: true},
  country: { type: String, required: true },
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  population: { type: Number, required: true },
  isDeleted:{type:Boolean,default:false}
},{
    timestamps: true,
    versionKey: false
});

export default mongoose.model<ICity>('City', citySchema);
