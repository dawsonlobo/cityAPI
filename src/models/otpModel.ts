import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Otp:
 *       type: object
 *       required:
 *         - userId
 *         - phone
 *         - otp
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the OTP document
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the OTP
 *         phone:
 *           type: string
 *           description: The phone number to which the OTP is sent
 *         otp:
 *           type: string
 *           description: The OTP (One-Time Password) sent to the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the OTP was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the OTP details were last updated
 *       example:
 *         _id: "607c2f9b2f2e1a3e589f3e5d"
 *         userId: "605f1f77d9b7b2a3d45b6c78"
 *         phone: "+1234567890"
 *         otp: "123456"
 *         createdAt: "2025-01-27T12:00:00Z"
 *         updatedAt: "2025-01-27T12:00:00Z"
 * 
 * /otps:
 *   post:
 *     tags: ['Authentication']
 *     summary: Generate a new OTP for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Otp'
 *     responses:
 *       201:
 *         description: Successfully generated OTP
 *       400:
 *         description: Invalid input data
 * /otps/{id}:
 *   get:
 *     tags: ['Authentication']
 *     summary: Retrieve an OTP by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the OTP to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved OTP
 *       404:
 *         description: OTP not found
 *   delete:
 *     tags: ['Authentication']
 *     summary: Delete an OTP by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the OTP to delete
 *     responses:
 *       200:
 *         description: Successfully deleted OTP
 *       404:
 *         description: OTP not found
 */

export interface IOtp extends Document {
    userId: mongoose.Types.ObjectId;
  phone: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    phone: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } }, // Expires in 5 minutes
  },
  { timestamps: true }
);

export const Otp = mongoose.model<IOtp>('Otp', otpSchema);
