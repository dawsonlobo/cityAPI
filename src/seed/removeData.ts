import User from '../models/userModel'; // Ensure this points to your Mongoose User model
import City from '../models/cityModel';
import State from '../models/stateModel';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  throw new Error("MongoDB URI is not defined in .env file.");
}
export async function removeUsers() {
  try {
    const usersToRemove = [
      { email: 'alice@example.com' },
      { email: 'bob@example.com' },
    ];

    // Find users by email
    const existingUsers = await User.find({ email: { $in: usersToRemove.map((user) => user.email) } });

    if (existingUsers.length > 0) {
      const emailsToRemove = existingUsers.map((user) => user.email);
      const removedUsers = await User.deleteMany({ email: { $in: emailsToRemove } });
      console.log(`Removed ${removedUsers.deletedCount} users.`);
    } else {
      console.log('No matching users found to remove.');
    }
  } catch (error) {
    console.error('Error while removing users:', error);
  }
}


export async function removeCities() {
  try {
    const citiesToRemove = [
      { name: 'New York' },
      { name: 'Los Angeles' },
    ];

    // Find cities by name
    const existingCities = await City.find({ name: { $in: citiesToRemove.map((city) => city.name) } });

    if (existingCities.length > 0) {
      const namesToRemove = existingCities.map((city) => city.name);
      const removedCities = await City.deleteMany({ name: { $in: namesToRemove } });
      console.log(`Removed ${removedCities.deletedCount} cities.`);
    } else {
      console.log('No matching cities found to remove.');
    }
  } catch (error) {
    console.error('Error while removing cities:', error);
  }
}


export async function removeStates() {
  try {
    const statesToRemove = [
      { name: 'California' },
      { name: 'New York' },
    ];

    // Find states by name
    const existingStates = await State.find({ name: { $in: statesToRemove.map((state) => state.name) } });

    if (existingStates.length > 0) {
      const namesToRemove = existingStates.map((state) => state.name);
      const removedStates = await State.deleteMany({ name: { $in: namesToRemove } });
      console.log(`Removed ${removedStates.deletedCount} states.`);
    } else {
      console.log('No matching states found to remove.');
    }
  } catch (error) {
    console.error('Error while removing states:', error);
  }
}
  mongoose
    .connect(mongoURI)
    .then(async () => {
      console.log("Connected to MongoDB");
     // const User = mongoose.model<IUser>('User', userSchema);

      await removeCities();
      await removeStates();
      await removeUsers();
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
