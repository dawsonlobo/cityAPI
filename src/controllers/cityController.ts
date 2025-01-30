import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import City from '../models/cityModel';
import { CustomRequest } from '../interfaces/customRequest';
import State from '../models/stateModel'; // Assuming the State model is defined in this file

export const addCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, population, country, latitude, longitude } = req.body;

    // Validate required fields
    if (!name || !country) {
     res.status(400).json({ message: 'City name and country are required.' });
    }

    // Use aggregation to check if the city already exists
    const existingCity = await City.aggregate([
      {
        $match: {
          name: { $regex: `^${name}$`, $options: 'i' }, // Case-insensitive match for the city name
          country: { $regex: `^${country}$`, $options: 'i' }, // Match for country
        },
      },
    ]);

    // If the city already exists, throw an error
    if (existingCity.length > 0) {
       res.status(409).json({ message: 'City already exists.' });
    }

    // Create a new city document
    const newCity = new City({
      name,
      population,
      country,
      latitude,
      longitude,
    });

    // Save the city to the database
    const savedCity = await newCity.save();

    // Respond with the newly created city
    res.status(201).json({
      message: 'City added successfully.',
      city: savedCity,
    });
  } catch (error) {
    // Handle errors
    console.error('Error adding city:', error);
    res.status(400).json({ message: 'Internal server error.' });
  }
};


export const updateCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { stateId, isDelete, ...updateData } = req.body;
    const { id: cityId } = req.params; // Get cityId from URL params

    // Log the cityId and isDelete to verify it's being passed correctly
    console.log('City ID from URL:', cityId);
    console.log('isDelete:', isDelete);

    // Step 1: Validate at least one field is provided for update
    if (!updateData && stateId === undefined && isDelete === undefined) {
      res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    // Step 2: If stateId is passed, check if it exists in the State collection
    if (stateId) {
      const stateExists = await State.findById(stateId);
      if (!stateExists) {
        res.status(400).json({ message: 'Invalid stateId provided.' });
      }
    }

    // Step 3: Check if the cityId exists
    const cityExists = await City.findById(cityId);
    if (!cityExists) {
      console.log('City not found with ID:', cityId); // Log if city is not found
       res.status(404).json({ message: 'City not found.' });
    }

    // Step 4: Prepare the update data
    let updateFields: any = {};

    // If fields are passed for update (other than stateId or isDelete)
    if (Object.keys(updateData).length > 0) {
      updateFields = { ...updateData };
    }

    // If stateId is passed, update the city's stateId
    if (stateId) {
      updateFields.stateId = new mongoose.Types.ObjectId(stateId); // Ensure valid ObjectId
    }

    // If isDelete is passed, ensure it's updated
    if (isDelete !== undefined) {
      updateFields.isDelete = isDelete; // This will ensure the isDelete field gets updated
    }

    // Log the updateFields to verify the data being sent for update
    console.log('Update Fields:', updateFields);

    // Step 5: Update the city document
    const updatedCity = await City.findByIdAndUpdate(
      cityId,
      updateFields,
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedCity) {
       res.status(404).json({ message: 'City not found.' });
    }

    // Step 6: Respond with the updated city details
    res.status(200).json({
      message: 'City updated successfully.',
      city: updatedCity, // Send the updated city object
    });

  } catch (error) {
    console.error('Error updating city:', error);
     res.status(400).json({ message: 'Error updating city', error });
  }
};


// Assuming the City model is defined here
// Adjust based on your project structure

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params; // Get city ID from URL params

    // Step 1: Check if the city exists
    const city = await City.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'states', // Assuming "states" is your states collection
          localField: 'stateId', // Field in the city document that references the state
          foreignField: '_id', // The _id field in the states collection
          as: 'stateDetails', // Alias for the state details in the result
        },
      },
      {
        $unwind: { path: '$stateDetails', preserveNullAndEmptyArrays: true }, // Unwind the stateDetails array (it could be empty)
      },
    ]);

    if (!city || city.length === 0) {
      res.status(404).json({ message: 'City not found.' });
    }

    // Step 2: Respond with the city and state details
    res.status(200).json({
      message: 'City data retrieved successfully.',
      data: { city: city[0] }, // Assuming only one city is found with the given ID
    });

  } catch (error) {
    console.error('Error retrieving city:', error);
    res.status(400).json({ message: 'Internal server error', error });
  }
};




 // Adjust the import based on your file structure
 // Get all cities with optional pagination, sorting, filters, and state details
export const getAll = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { search, filters, projections, page = 1, limit = 10, sort } = req.body;

    console.log('Received request body: ' + JSON.stringify(req.body));

    // Sanitize and validate pagination parameters
    const pageNumber = Math.max(1, parseInt(page as any)); // Ensure page is at least 1
    const limitNumber = Math.max(1, parseInt(limit as any)); // Ensure limit is at least 1

    // Build the search criteria for city names
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
          const field = item.field; // field name (e.g., "population")
          const order = item.order; // sort order (1 or -1)
          acc[field] = order;
          return acc;
        }, {})
      : { name: 1 }; // Default to sorting by name in ascending order

    // Perform aggregation to get cities with state details, filters, sorting, and pagination
    const citiesWithStateDetails = await City.aggregate([
      { $match: filterCriteria }, // Apply filters
      {
        $lookup: {
          from: 'states', // Lookup from the 'states' collection
          localField: 'stateId', // Field in 'City' to match
          foreignField: '_id', // Field in 'State' to match
          as: 'stateDetails', // Alias for state details
        },
      },
      { $unwind: { path: '$stateDetails', preserveNullAndEmptyArrays: true } }, // Unwind state details to make it an object
      { $project: projection }, // Include specified fields (projections)
      { $sort: sortCriteria }, // Apply sorting
      { $skip: skip }, // Skip for pagination
      { $limit: limitNumber }, // Limit for pagination
    ]);

    // Fetch the total count of matching documents for pagination metadata
    const totalCount = await City.countDocuments(filterCriteria);

    // Respond with the required format
     res.status(200).json({
      status: 200,
      data: {
        totalCount,
        tableData: citiesWithStateDetails, // Rename to tableData
      },
      message: 'Cities with their state details fetched successfully',
    });

  } catch (err) {
    //next(err); // Pass errors to error handling middleware
  }
};
