import { IUser } from './models/userModel'; // Adjust the path to your user model

declare global {
  namespace Express {
    interface Request {
      user?: User; // Extend Request to include the `user` property, which will be of type `IUser`
    }
  }
}
