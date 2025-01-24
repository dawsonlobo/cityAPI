  // import mongoose, { Schema, Document } from 'mongoose';

  // export interface IUser extends Document {
  //   email: string;
  //   password: string;
  //   name?: string;
  //   token?: string;
  //   createdAt: Date;
  //   updatedAt: Date;
  // }

  // // Add type safety to the model
  // const UserSchema = new Schema<IUser>({
  //   email: { type: String, required: true, lowercase: true },
  //   password: { type: String, required: true },
  //   name: { type: String, required: false },
  //   token: { type: String }, // Optional token field
  // }, {
  //   timestamps: true
  // });


  //   export default mongoose.model<IUser>('User', UserSchema);