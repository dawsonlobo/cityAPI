import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Counter:
 *       type: object
 *       required:
 *         - name
 *         - cityId
 *         - stateId
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the counter document
 *         name:
 *           type: string
 *           description: The name of the counter
 *         cityId:
 *           type: integer
 *           description: The ID of the city where the counter is located
 *         stateId:
 *           type: integer
 *           description: The ID of the state where the counter is located
 *       example:
 *         _id: "607c2f9b2f2e1a3e589f3e5d"
 *         name: "Main Counter"
 *         cityId: 1
 *         stateId: 1
 * 
 * /counters:
 *   post:
 *     tags: ['Counter API']
 *     summary: Create a new counter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Counter'
 *     responses:
 *       201:
 *         description: Successfully created counter
 *       400:
 *         description: Invalid input data
 * /counters/{id}:
 *   get:
 *     tags: ['Counter API']
 *     summary: Retrieve a counter by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the counter to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved counter
 *       404:
 *         description: Counter not found
 *   put:
 *     tags: ['Counter API']
 *     summary: Update a counter by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the counter to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Counter'
 *     responses:
 *       200:
 *         description: Successfully updated counter
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Counter not found
 *   delete:
 *     tags: ['Counter API']
 *     summary: Delete a counter by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the counter to delete
 *     responses:
 *       200:
 *         description: Successfully deleted counter
 *       404:
 *         description: Counter not found
 */

export interface ICounter extends Document {
  name: string;
  cityId: number;
  stateId: number;
}

const counterSchema = new Schema<ICounter>({
  name: { type: String, required: true },
  cityId: { type: Number, default: 1 },
  stateId: { type: Number, default: 1}
});

export const Counter: Model<ICounter> = mongoose.model<ICounter>('Counter', counterSchema);