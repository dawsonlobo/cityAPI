import mongoose, { Schema, Document } from 'mongoose';
/**
 * @swagger
 * components:
 *   schemas:
 *     City:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the city
 *         country:
 *           type: string
 *           description: The country the city belongs to
 *         stateId:
 *           type: string
 *           description: The ID of the associated state (reference to the State model)
 *         population:
 *           type: number
 *           description: The population of the city
 *         isDeleted:
 *           type: boolean
 *           description: Flag to indicate if the city is deleted
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the city was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the city was last updated
 *       required:
 *         - name
 *         - country
 *         - stateId
 *         - population
 */


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
