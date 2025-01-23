import { Request, Response } from 'express';
import { City } from '../models/cityModel';
import { Counter } from '../models/counterModel';
import { State } from '../models/stateModel';
// Get all cities
export const getAllCities = async (req: Request, res: Response): Promise<void> => {
  const { page = '1', limit = '40', filter = {}, sort = '', search = '', projection = '', id } = req.body;

  const query: Record<string, any> = {};
  const options: Record<string, any> = {};

  try {
    if (id) query._id = id;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (filter && typeof filter === 'object') Object.assign(query, filter);

    if (projection) {
      options.projection = projection.split(',').reduce((acc: Record<string, number>, field: string) => {
        const trimmedField = field.trim();
        acc[trimmedField.startsWith('-') ? trimmedField.slice(1) : trimmedField] =
          trimmedField.startsWith('-') ? 0 : 1;
        return acc;
      }, {});
    }

    let sortObj: Record<string, 1 | -1> = {};
    if (sort) {
      const [key, order] = sort.split(':');
      sortObj[key] = order === 'desc' ? -1 : 1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const cities = await City.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'states', // Collection name of the State model
          localField: 'stateId',
          foreignField: '_id',
          as: 'stateDetails', // Add state details to this key
        },
      },
      { 
        $unwind: { 
          path: '$stateDetails', 
          preserveNullAndEmptyArrays: true // Ensures cities with deleted states still appear
        },
      },
      {
        $addFields: {
          stateDeleted: { $ifNull: ['$stateDetails.isDeleted', true] }, // Add a field to indicate if the state is deleted
        },
      },
      ...(sort ? [{ $sort: sortObj }] : []),
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    const totalCities = await City.countDocuments(query);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCities / parseInt(limit)),
      totalCities,
      cities,
    });
  } catch (error) {
    console.error('Error fetching cities:', error); // Log the error for debugging
    res.status(500).json({ error: 'Error fetching cities. Please try again later.' });
  }
};


// Get city by ID
// Get city by ID with state details and optional projection
export const getCityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const cityId = parseInt(req.params.id);
    const { project } = req.body;

    if (isNaN(cityId)) {
      res.status(400).json({ message: 'Invalid city ID format. ID must be a number.' });
      return;
    }

    const pipeline: any[] = [
      { $match: { _id: cityId, isDeleted: false } }, // Ensure the city is not deleted
      {
        $lookup: {
          from: 'states', // State collection name
          localField: 'stateId',
          foreignField: '_id',
          as: 'stateDetails', // Add state details to this key
          pipeline: [
            { $match: { isDeleted: { $ne: true } } } // Only include states that are not deleted
          ]
        },
      },
      { $unwind: { path: '$stateDetails', preserveNullAndEmptyArrays: true } }, // Unwind the state details to get a single state object
    ];

    // If projection is provided in the request, add it to the pipeline
    if (Array.isArray(project) && project.length > 0) {
      const projection: Record<string, number> = { _id: 1 }; // Always include _id
      project.forEach((field: string) => {
        projection[field] = 1; // Add other fields specified in the request
      });
      pipeline.push({ $project: projection });
    }

    const city = await City.aggregate(pipeline);

    if (city.length === 0) {
      res.status(404).json({ message: 'City not found or state is deleted.' });
      return;
    }

    res.json({ city: city[0] });
  } catch (error) {
    console.error('Error fetching city by ID:', error);
    res.status(500).json({ error: 'Error fetching city by ID. Please try again later.' });
  }
};


// Add a new city
export const addCity = async (req: Request, res: Response): Promise<void> => {
  const { name, population, country, latitude, longitude, stateId } = req.body;

  try {
    // Validate required fields
    if (!name || !population || !country || !latitude || !longitude) {
      res.status(400).json({ message: 'All fields are required: name, population, country, latitude, longitude.' });
      return;
    }

    // Convert latitude and longitude to numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      res.status(400).json({ message: 'Latitude and Longitude must be valid numbers.' });
      return;
    }

    // Check if the city already exists
    const existingCity = await City.findOne({ name });
    if (existingCity) {
      res.status(400).json({ message: 'City name must be unique.' });
      return;
    }

    // If a stateId is provided, validate the state
    let stateIdNum = null;
    if (stateId) {
      stateIdNum = Number(stateId); // Convert stateId to a number

      if (isNaN(stateIdNum)) {
        res.status(400).json({ message: 'Invalid state ID format. stateId must be a number.' });
        return;
      }

      const state = await State.findOne({ _id: stateIdNum, isDeleted: false });
      if (!state) {
        res.status(400).json({ message: 'Invalid state ID or the state is deleted.' });
        return;
      }
    }

    // Generate city ID
    const counter = await Counter.findOneAndUpdate(
      { name: 'city' },
      { $inc: { cityId: 1 } },
      { new: true, upsert: true }
    );

    if (!counter) throw new Error('Failed to generate city ID');

    // Create the new city object
    const newCity = new City({
      _id: counter.cityId,
      name,
      population,
      country,
      latitude: lat,
      longitude: lon,
      stateId: stateIdNum, // Set stateId as number (null if not provided)
      isDeleted: false,
    });

    // Save the city to the database
    await newCity.save();

    res.status(201).json({ message: 'City added successfully!', city: newCity });
  } catch (error) {
    console.error('Error adding city:', error);
    res.status(500).json({ error: 'Error adding city. Please try again later.' });
  }
};



// Update a city
export const updateCity = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { stateId, name, population, country, latitude, longitude } = req.body;

  try {
    // Validate if updates are provided
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ message: 'No updates provided.' });
      return;
    }

    // Find city by ID and check if it exists and is not deleted
    const city = await City.findOne({ _id: id, isDeleted: false });
    if (!city) {
      res.status(404).json({ message: 'City not found or already deleted.' });
      return;
    }

    // If stateId is provided, validate if the state exists and is not deleted
    if (stateId) {
      const state = await State.findOne({ _id: stateId, isDeleted: false });
      if (!state) {
        res.status(400).json({ message: 'The specified state does not exist or is deleted.' });
        return;
      }
    }

    // Prepare the update object
    const updates: any = {
      name: name || city.name,
      population: population || city.population,
      country: country || city.country,
      latitude: latitude || city.latitude,
      longitude: longitude || city.longitude,
      stateId: stateId || city.stateId,  // If stateId is provided, update it
    };

    // Apply updates to the city
    Object.assign(city, updates);
    await city.save();

    res.json({ message: 'City updated successfully!', city });
  } catch (error) {
    console.error('Error updating city:', error);
    res.status(500).json({ error: 'Error updating city. Please try again later.' });
  }
};



// Soft delete a city
export const deleteCity = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedCity = await City.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!deletedCity) {
      res.status(404).json({ message: 'City not found or already deleted.' });
      return;
    }

    res.json({ message: 'City marked as deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting city. Please try again later.' });
  }
};
