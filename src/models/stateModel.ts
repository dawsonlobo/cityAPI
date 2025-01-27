import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     State:
 *       type: object
 *       required:
 *         - name
 *         - population
 *         - capital
 *         - gdp
 *       properties:
 *         _id:
 *           type: integer
 *           description: The unique ID of the state
 *         name:
 *           type: string
 *           description: Name of the state
 *         population:
 *           type: integer
 *           description: Population of the state
 *         capital:
 *           type: string
 *           description: Capital of the state
 *         gdp:
 *           type: number
 *           description: Gross Domestic Product of the state
 *         isDeleted:
 *           type: boolean
 *           description: Whether the state is marked as deleted
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the state was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the state details were last updated
 * 
 * /states:
 *   post:
 *     tags: ['State API']
 *     summary: Create a new state
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/State'
 *     responses:
 *       201:
 *         description: Successfully created state
 *       400:
 *         description: Invalid input data
 * /states/{id}:
 *   get:
 *     tags: ['State API']
 *     summary: Retrieve a state by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the state to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved state
 *       404:
 *         description: State not found
 *   put:
 *     tags: ['State API']
 *     summary: Update a state by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the state to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/State'
 *     responses:
 *       200:
 *         description: Successfully updated state
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: State not found
 *   delete:
 *     tags: ['State API']
 *     summary: Delete a state by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the state to delete
 *     responses:
 *       200:
 *         description: Successfully deleted state
 *       404:
 *         description: State not found
 */

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
