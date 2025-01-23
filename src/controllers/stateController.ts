import { Request, Response } from 'express';
import { State } from '../models/stateModel'; // Assuming you have a State model
import { Counter } from '../models/counterModel';

// Get all states
export const getAllStates = async (req: Request, res: Response): Promise<void> => {
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

    const states = await State.find(query, options.projection).skip(skip).limit(parseInt(limit)).sort(options.sort);
    const totalStates = await State.countDocuments(query);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalStates / parseInt(limit)),
      totalStates,
      states,
    });
  } catch (error) {
    console.error('Error fetching states:', error); // Log the error for debugging
    res.status(500).json({ error: 'Error fetching states. Please try again later.' });
  }
};

// Get state by ID
export const getStateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const stateId = parseInt(req.params.id);
    const { project } = req.body;

    if (isNaN(stateId)) {
      res.status(400).json({ message: 'Invalid state ID format. ID must be a number.' });
      return;
    }

    const pipeline: any[] = [{ $match: { _id: stateId } }];
    if (Array.isArray(project) && project.length > 0) {
      const projection: Record<string, number> = { _id: 1 };
      project.forEach((field: string) => {
        projection[field] = 1;
      });
      pipeline.push({ $project: projection });
    }

    const state = await State.aggregate(pipeline);
    if (state.length === 0) {
      res.status(404).json({ message: 'State not found' });
      return;
    }

    res.json({ state: state[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching state by ID. Please try again later.' });
  }
};

// Add a new state
export const addState = async (req: Request, res: Response): Promise<void> => {
  const { name, population, capital, gdp } = req.body;

  try {
    // Check if state already exists (case-insensitive)
    const existingState = await State.findOne({ 
      name: { $regex: `^${name}$`, $options: 'i' }, 
      isDeleted: false 
    });

    if (existingState) {
      res.status(409).json({ message: 'State already exists' });
      return;
    }

    // Generate unique state ID
    const counter = await Counter.findOneAndUpdate(
      { name: 'state' },
      { $inc: { stateId: 1 } },
      { new: true, upsert: true }
    );

    if (!counter) {
      res.status(500).json({ message: 'Failed to generate state ID' });
      return;
    }

    // Create new state
    const newState = new State({
      _id: counter.stateId,
      name,
      population,
      capital,
      gdp,
      isDeleted: false
    });

    await newState.save();
    res.status(201).json({ 
      message: 'State added successfully', 
      state: newState 
    });
  } catch (error) {
    console.error('State creation error:', error);
    res.status(500).json({ message: 'Failed to create state' });
  }
};
// Update a state
export const updateState = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Validate updates
    if (!updates || Object.keys(updates).length === 0) {
      res.status(400).json({ message: 'No updates provided.' });
      return;
    }

    // Find state by ID and check if it exists and is not deleted
    const state = await State.findOne({ _id: id, isDeleted: false });
    if (!state) {
      res.status(404).json({ message: 'State not found or already deleted.' });
      return;
    }

    // Apply updates
    Object.assign(state, updates);
    await state.save();

    res.json({ message: 'State updated successfully!', state });
  } catch (error) {
    console.error('Error updating state:', error);
    res.status(500).json({ error: 'Error updating state. Please try again later.' });
  }
};

// Soft delete a state
export const deleteState = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedState = await State.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!deletedState) {
      res.status(404).json({ message: 'State not found or already deleted.' });
      return;
    }

    res.json({ message: 'State marked as deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting state. Please try again later.' });
  }
};
