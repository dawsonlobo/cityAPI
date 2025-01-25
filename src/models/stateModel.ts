import mongoose, { Schema, Document } from 'mongoose';
/**
 * @swagger
 * components:
 *   schemas:
 *     State:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the state
 *         population:
 *           type: number
 *           description: The population of the state
 *         gdp:
 *           type: number
 *           description: The GDP of the state
 *         capital:
 *           type: string
 *           description: The capital city of the state
 *         isDeleted:
 *           type: boolean
 *           description: Flag to indicate if the state is deleted
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the state was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the state was last updated
 *       required:
 *         - name
 *         - population
 *         - gdp
 *         - capital
 */

interface IState extends Document {
  name: string;
  population: number;
  gdp:number,
  capital:string,
  isDeleted:Boolean
}

const stateSchema: Schema = new Schema({
  name: { type: String, unique: true },
  population:{type:Number},
  gdp:{type:Number},
  capital: {type:String},
  isDeleted:{type:Boolean,default:false}
},{
    timestamps: true,
    versionKey: false
});

export default mongoose.model<IState>('states', stateSchema);
