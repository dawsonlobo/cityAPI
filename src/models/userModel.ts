import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  phone: string;
  password: string;
  token:string
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],  // Making the name field required
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      unique: true,  // Ensure email is unique
      sparse: true,  // Allow null or missing emails
    },
    //token: { type: String, unique: true }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
