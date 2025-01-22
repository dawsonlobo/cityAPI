import { Request, Response } from 'express';
import { City } from '../models/cityModel';
import { Counter } from '../models/counterModel';

// Get all cities
export const getAllCities = async (req: Request, res: Response): Promise<void> => {
  const { page = '1', limit = '10', filter = {}, sort = '', search = '', projection = '', id } = req.body;

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

    if (sort) {
      const [key, order] = sort.split(':');
      options.sort = { [key]: order === 'desc' ? -1 : 1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const cities = await City.find(query, options.projection).skip(skip).limit(parseInt(limit)).sort(options.sort);
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
export const getCityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const cityId = parseInt(req.params.id);
    const { project } = req.body;

    if (isNaN(cityId)) {
      res.status(400).json({ message: 'Invalid city ID format. ID must be a number.' });
      return;
    }

    const pipeline: any[] = [{ $match: { _id: cityId } }];
    if (Array.isArray(project) && project.length > 0) {
      const projection: Record<string, number> = { _id: 1 };
      project.forEach((field: string) => {
        projection[field] = 1;
      });
      pipeline.push({ $project: projection });
    }

    const city = await City.aggregate(pipeline);
    if (city.length === 0) {
      res.status(404).json({ message: 'City not found' });
      return;
    }

    res.json({ city: city[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching city by ID. Please try again later.' });
  }
};

// Add a new city
export const addCity = async (req: Request, res: Response): Promise<void> => {
  const { name, population, country, latitude, longitude } = req.body;

  try {
    if (!name || !population || !country || !latitude || !longitude) {
      res.status(400).json({ message: 'All fields are required: name, population, country, latitude, longitude.' });
      return;
    }

    const existingCity = await City.findOne({ name, isDeleted: false });
    if (existingCity) {
      res.status(400).json({ message: 'City name must be unique.' });
      return;
    }

    const counter = await Counter.findOneAndUpdate(
      { name: 'city' },
      { $inc: { cityId: 1 } },
      { new: true, upsert: true }
    );

    if (!counter) throw new Error('Failed to generate city ID');

    const newCity = new City({
      _id: counter.cityId,
      name,
      population,
      country,
      latitude,
      longitude,
      isDeleted: false,
    });

    await newCity.save();
    res.status(201).json({ message: 'City added successfully!', city: newCity });
  } catch (error) {
    res.status(500).json({ error: 'Error adding city. Please try again later.' });
  }
};

// Update a city
export const updateCity = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Validate updates
    if (!updates || Object.keys(updates).length === 0) {
      res.status(400).json({ message: 'No updates provided.' });
      return;
    }

    // Find city by ID and check if it exists and is not deleted
    const city = await City.findOne({ _id: id, isDeleted: false });
    if (!city) {
      res.status(404).json({ message: 'City not found or already deleted.' });
      return;
    }

    // Apply updates
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
