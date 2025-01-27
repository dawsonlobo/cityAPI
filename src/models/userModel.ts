import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the user document
 *         name:
 *           type: string
 *           description: The name of the user
 *         phone:
 *           type: string
 *           description: The phone number of the user (must be unique)
 *         isDeleted:
 *           type: boolean
 *           description: Indicates whether the user is deleted or not
 *       example:
 *         _id: "607c2f9b2f2e1a3e589f3e5d"
 *         name: "John Doe"
 *         phone: "+1234567890"
 *         isDeleted: false
 * 
 * /users:
 *   post:
 *     tags: ['User API']
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Successfully created user
 *       400:
 *         description: Invalid input data
 * /users/{id}:
 *   get:
 *     tags: ['User API']
 *     summary: Retrieve a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       404:
 *         description: User not found
 *   put:
 *     tags: ['User API']
 *     summary: Update a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successfully updated user
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: User not found
 *   delete:
 *     tags: ['User API']
 *     summary: Delete a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: Successfully deleted user
 *       404:
 *         description: User not found
 */

export interface IUser extends Document{
    name: string;
    phone: string;
  isDeleted: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, unique: true, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
