import City from "../models/cityModel";
import State from "../models/stateModel";
import User from "../models/userModel";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import { IUser, userSchema } from "../models/userModel";
dotenv.config();
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  throw new Error("MongoDB URI is not defined in .env file.");
}

export async function addUsers() {
  const users = [
    { name: "Alice", email: "alice@example.com", password: "password123", phone: "1234567890" },
    { name: "Bob", email: "bob@example.com", password: "password456", phone: "0987654321" },
  ];

  // Find existing users by email
  const existingUsers = await User.find({
    email: { $in: users.map((user) => user.email) },
  });

  // Get emails of the existing users
  const existingEmails = existingUsers.map((user: any) => user.email); // Type assertion to 'any' to resolve type issue

  // Filter out the users that already exist
  const newUsers = users.filter((user) => !existingEmails.includes(user.email));

  if (newUsers.length > 0) {
    // Use insertMany for bulk insert if new users exist
    await User.insertMany(newUsers);
    console.log(`Inserted ${newUsers.length} new users.`);
  } else {
    console.log("No new users to insert.");
  }
}

// Import your City model
// Import the City model

export async function addCities() {
  const cities = [
    { name: "New York", country: "USA", population: 8419600 },
    { name: "Los Angeles", country: "USA", population: 3980400 },
    // Add more cities here with stateId references
  ];

  // Find existing cities by name
  const existingCities = await City.find({
    name: { $in: cities.map((city) => city.name) },
  });

  // Get names of the existing cities
  const existingCityNames = existingCities.map((city: any) => city.name);

  // Filter out the cities that already exist
  const newCities = cities.filter(
    (city) => !existingCityNames.includes(city.name)
  );

  if (newCities.length > 0) {
    // Use insertMany for bulk insert if new cities exist
    await City.insertMany(newCities);
    console.log(`Inserted ${newCities.length} new cities.`);
  } else {
    console.log("No new cities to insert.");
  }
}
// Import your State model
// Import the State model

export async function addStates() {
  const states = [
    {
      name: "California",
      population: 39538223,
      gdp: 3100000,
      capital: "Sacramento",
    },
    { name: "New York", population: 20201249, gdp: 1700000, capital: "Albany" },
    // Add more states here with population, gdp, and capital
  ];

  // Find existing states by name
  const existingStates = await State.find({
    name: { $in: states.map((state) => state.name) },
  });

  // Get names of the existing states
  const existingStateNames = existingStates.map((state: any) => state.name);

  // Filter out the states that already exist
  const newStates = states.filter(
    (state) => !existingStateNames.includes(state.name)
  );

  if (newStates.length > 0) {
    // Use insertMany for bulk insert if new states exist
    await State.insertMany(newStates);
    console.log(`Inserted ${newStates.length} new states.`);
  } else {
    console.log("No new states to insert.");
  }
}

  mongoose
    .connect(mongoURI)
    .then(async () => {
      console.log("Connected to MongoDB");
     // const User = mongoose.model<IUser>('User', userSchema);

      await addCities();
      await addUsers();
      await addStates();
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
