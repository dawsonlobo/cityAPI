import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User, { IUser, UserRole } from '../models/userModel'; // Adjust the import based on your file structure
import { CustomRequest } from '../interfaces/customRequest';

export const addUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone, password, email, role } = req.body;

    // Validate required fields
    if (!name || !phone || !password) {
      res.status(400).json({ message: 'Name, phone number, and password are required.' });
      return;
    }

    // Check if email is provided and if it's unique
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
         res.status(409).json({ message: 'Email already exists.' });
      }
    }

    // Create a new user document
    const newUser = new User({
      name,
      phone,
      password,
      email,
      role: role || UserRole.USER, // Default to 'user' role
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Respond with the newly created user
    res.status(201).json({
      message: 'User added successfully.',
      user: savedUser,
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(400).json({ message: 'Internal server error.' });
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone, email, role } = req.body;
    const { id: userId } = req.params; // Get userId from URL params

    // Validate required fields
    if (!name && !phone && !email && !role) {
       res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
       res.status(404).json({ message: 'User not found.' });
    }

    // Prepare the update data
    const updateFields: any = {};

    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;

    // Update the user document
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
       res.status(404).json({ message: 'User not found.' });
    }

    // Respond with the updated user details
    res.status(200).json({
      message: 'User updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: 'Internal server error.' });
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params; // Get user ID from URL params

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
       res.status(404).json({ message: 'User not found.' });
    }

    // Respond with the user data
    res.status(200).json({
      message: 'User data retrieved successfully.',
      user,
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(400).json({ message: 'Internal server error.' });
  }
};

export const getAll = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, filters, projections, page = 1, limit = 10, sort } = req.body;

    // Sanitize and validate pagination parameters
    const pageNumber = Math.max(1, parseInt(page as any)); // Ensure page is at least 1
    const limitNumber = Math.max(1, parseInt(limit as any)); // Ensure limit is at least 1

    // Build the search criteria for user fields
    const searchCriteria = search ? { name: { $regex: search, $options: 'i' } } : {};

    // Combine search and filter criteria
    const filterCriteria = { ...searchCriteria, ...filters };

    // Build the projection object to include only specified fields (projections)
    const projection = Array.isArray(projections)
      ? projections.reduce((acc: any, field: string) => {
          acc[field] = 1;
          return acc;
        }, { _id: 0 })
      : { _id: 0 }; // Default to excluding _id if no projections are provided

    // Calculate the number of documents to skip for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Handle sorting with correct structure (array of objects)
    const sortCriteria = sort && Array.isArray(sort)
      ? sort.reduce((acc: any, item: any) => {
          const field = item.field; // field name (e.g., "name")
          const order = item.order; // sort order (1 or -1)
          acc[field] = order;
          return acc;
        }, {})
      : { name: 1 }; // Default to sorting by name in ascending order

    // Perform aggregation to get users with filtering, sorting, and pagination
    const users = await User.aggregate([
      { $match: filterCriteria }, // Apply filters
      { $project: projection }, // Include specified fields (projections)
      { $sort: sortCriteria }, // Apply sorting
      { $skip: skip }, // Skip for pagination
      { $limit: limitNumber }, // Limit for pagination
    ]);

    // Fetch the total count of matching documents for pagination metadata
    const totalCount = await User.countDocuments(filterCriteria);

    // Respond with the required format
    res.status(200).json({
      status: 200,
      data: {
        totalCount,
        tableData: users, // Rename to tableData
      },
      message: 'Users fetched successfully',
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(400).json({ message: 'Internal server error.' });
  }
};
