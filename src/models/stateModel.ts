import mongoose, { Schema, Document } from 'mongoose';

interface IState extends Document {
  name: string;
  population: number;
  gdp:number,
  capital:string,
  isDeleted:Boolean
}

const stateSchema: Schema = new Schema({
  name: { type: String},
  population:{type:Number},
  gdp:{type:Number},
  capital: {type:String},
  isDeleted:{type:Boolean,default:false}
},{
    timestamps: true
});

export default mongoose.model<IState>('states', stateSchema);
