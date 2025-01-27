import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     City:
 *       type: object
 *       required:
 *         - name
 *         - population
 *         - country
 *         - latitude
 *         - longitude
 *       properties:
 *         _id:
 *           type: integer
 *           description: The unique ID of the city
 *         name:
 *           type: string
 *           description: Name of the city
 *         population:
 *           type: integer
 *           description: Population of the city
 *         country:
 *           type: string
 *           description: Country where the city is located
 *         latitude:
 *           type: number
 *           format: float
 *           description: Latitude coordinate of the city
 *         longitude:
 *           type: number
 *           format: float
 *           description: Longitude coordinate of the city
 *         stateId:
 *           type: integer
 *           nullable: true
 *           description: The state ID where the city is located (optional)
 *         isDeleted:
 *           type: boolean
 *           description: Whether the city is marked as deleted
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the city was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the city details were last updated
 * 
 * /cities:
 *   post:
 *     tags: ['City API']
 *     summary: Create a new city
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       201:
 *         description: Successfully created city
 *       400:
 *         description: Invalid input data
 * /cities/{id}:
 *   get:
 *     tags: ['City API']
 *     summary: Retrieve a city by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the city to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved city
 *       404:
 *         description: City not found
 *   put:
 *     tags: ['City API']
 *     summary: Update a city by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the city to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       200:
 *         description: Successfully updated city
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: City not found
 *   delete:
 *     tags: ['City API']
 *     summary: Delete a city by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the city to delete
 *     responses:
 *       200:
 *         description: Successfully deleted city
 *       404:
 *         description: City not found
 */



export interface ICity extends Document {
  _id: number;
  name: string;
  population: number;
  country: string;
  latitude: number;
  longitude: number;
  stateId: number | null;
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
  stateId: { type: Number, ref: 'State', required: false }, // Reference to State
  isDeleted: {type: Boolean, default: false}
}, { timestamps: true });

export const City: Model<ICity> = mongoose.model<ICity>('cities', citySchema);