import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import City from '../models/cityModel';
import { CustomRequest } from '../interfaces/customRequest';

// Get all cities with optional pagination, sorting, and filters
export const getAllCities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, filters, fields, page = 1, limit = 10, sort } = req.body;

    console.log('Received request body: ' + JSON.stringify(req.body));
    
    // Sanitize and validate pagination parameters
    const pageNumber = Math.max(1, parseInt(page as any)); // Ensure page is at least 1
    const limitNumber = Math.max(1, parseInt(limit as any)); // Ensure limit is at least 1
    
    // Build the search criteria for city names
    const searchCriteria = search ? { name: { $regex: search, $options: 'i' } } : {};
    
    // Combine search and filter criteria
    const filterCriteria = { ...searchCriteria, ...filters };

    // Build the projection object to include only specified fields
    const projection = Array.isArray(fields)
      ? fields.reduce((acc: any, field: string) => {
          acc[field] = 1;
          return acc;
        }, { _id: 0 }) 
      : { _id: 0 }; // Default to excluding _id if no fields are provided

    // Calculate the number of documents to skip for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Use the provided sort criteria or default to sorting by 'name'
    const sortCriteria = sort && Array.isArray(sort) 
      ? sort.reduce((acc: any, item: any) => {
          const field = item[0]; // field name (e.g., "population")
          const order = item[1]; // sort order (1 or -1)
          acc[field] = order;
          return acc;
        }, {})
      : { name: 1 }; // Default to sorting by name in ascending order

    // Fetch the total count of matching documents
    const totalCount = await City.countDocuments(filterCriteria);
    
    // Fetch the cities with pagination, projection, and sorting
    const cities = await City.find(filterCriteria, projection)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limitNumber);

    // Return the response with pagination metadata
    res.json({
      metadata: {
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        pageSize: cities.length,
      },
      cities,
    });
  } catch (err) {
    next(err); // Pass errors to error handling middleware
  }
};

// Get city by ID with projection
export const getCityWithProjection = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;  // Get city ID from params

    if (!id) {
      req.customReq = {
        statusCode: 400,
        data: null,
        message: 'City ID is required.',
      };
      return next();
    }

    const city = await City.aggregate([
      { 
        $match: { 
          _id: new mongoose.Types.ObjectId(id),  // Match by city ID
          isDeleted: false  // Ensure the city is not deleted
        }
      }
    ]);

    if (!city || city.length === 0) {
      req.customReq = {
        statusCode: 404,
        data: null,
        message: 'City not found or already deleted.',
      };
      return next();
    }

    req.customReq = {
      statusCode: 200,
      data: city[0],  // Return the first city from the aggregation result
      message: 'City fetched successfully.',
    };
    next();  // Pass control to the next middleware or exit point
  } catch (err) {
    next(err);  // Pass any errors to error handling middleware
  }
};

// Add a city
export const addCity = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Destructure the required fields directly from the request body
    const { name, population, country, latitude, longitude } = req.body;

    // Create a new City instance with the provided data
    const newCity = new City({
      name,
      population,
      country,
      latitude,
      longitude,
    });

    // Save the city to the database
    const savedCity = await newCity.save();

    // Set customReq with success status, message, and saved data
    req.customReq = {
      statusCode: 201,
      data: savedCity,
      message: 'City added successfully.',
    };

    next();  // Pass control to the next middleware (usually the exitPoint)
  } catch (err) {
    req.customReq = {
      statusCode: 500,
      data: null,
      message: 'Failed to add city.',
    };
    next(err);  // Pass the error to error handling middleware
  }
};

// Get a single city by ID
export const getCityById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cityId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      req.customReq = {
        statusCode: 400,
        data: null,
        message: 'Invalid City ID format.',
      };
      return next();
    }

    const city = await City.findById(cityId);

    if (!city) {
      req.customReq = {
        statusCode: 404,
        data: null,
        message: 'City not found.',
      };
      return next();
    }

    req.customReq = {
      statusCode: 200,
      data: city,
      message: 'City fetched successfully.',
    };
    next();
  } catch (err) {
    req.customReq = {
      statusCode: 500,
      data: null,
      message: 'Something went wrong!',
    };
    next(err);
  }
};

// Update a city
export const updateCity = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updateData = req.body; // Get the update data from the request body

    // Validate that at least one field is being updated
    if (!updateData || Object.keys(updateData).length === 0) {
      req.customReq = {
        statusCode: 400,
        data: null,
        message: 'No valid fields provided for update.',
      };
      return next(); // Pass control to the next middleware
    }

    // Find the city by ID and update the fields provided in the body
    const updatedCity = await City.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedCity) {
      req.customReq = {
        statusCode: 404,
        data: null,
        message: 'City not found.',
      };
      return next(); // Pass control to the next middleware (error handler)
    }

    req.customReq = {
      statusCode: 200,
      data: updatedCity,
      message: 'City updated successfully.',
    };
    next(); // Proceed to the next middleware (success handler)
  } catch (err) {
    req.customReq = {
      statusCode: 500,
      data: null,
      message: 'Something went wrong!',
    };
    next(err); // Pass error to error-handling middleware
  }
};

// Delete a city
export const deleteCity = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedCity = await City.findByIdAndDelete(req.params.id);
    if (!deletedCity) {
      req.customReq = {
        statusCode: 404,
        data: null,
        message: 'City not found.',
      };
      return next();
    }

    req.customReq = {
      statusCode: 200,
      data: null,
      message: 'City deleted successfully.',
    };
    next();
  } catch (err) {
    req.customReq = {
      statusCode: 500,
      data: null,
      message: 'Something went wrong!',
    };
    next(err);
  }
};
