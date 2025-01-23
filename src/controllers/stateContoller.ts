import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import State from '../models/stateModel'; // Assuming you have a model called State
import { CustomRequest } from '../interfaces/customRequest'; // Importing the custom request interface
import { validationResult, body } from 'express-validator';

// Get all states with optional pagination, sorting, and filters
export const getAllStates = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, filters, projections, page = 1, limit = 10, sort } = req.body;

    console.log('Received request body:', JSON.stringify(req.body));

    // Sanitize and validate pagination parameters
    const pageNumber = Math.max(1, parseInt(page as any)); // Ensure page is at least 1
    const limitNumber = Math.max(1, parseInt(limit as any)); // Ensure limit is at least 1

    // Validate that projections is an array or set a default value
    const projection = Array.isArray(projections)
      ? projections.reduce((acc: any, field: string) => {
          acc[field] = 1;
          return acc;
        }, { _id: 0 })
      : { _id: 0 }; // Default to excluding _id if no fields are provided

    console.log('Projection:', projection);

    // Build the search criteria for state names (only if search is provided)
    const searchCriteria = search ? { name: { $regex: search, $options: 'i' } } : {};

    // Combine search and filter criteria, and ensure 'isDeleted' is always false
    const filterCriteria = {
      ...searchCriteria,
      ...filters,
      isDeleted: false, // Only include states where isDeleted is false
    };

    console.log('Filter Criteria:', filterCriteria);

    // Calculate the number of documents to skip for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Validate the sort parameter, and default to sorting by 'name'
    const sortCriteria = sort && Array.isArray(sort)
      ? sort.reduce((acc: any, item: any) => {
          const field = item[0]; // field name (e.g., "population")
          const order = item[1]; // sort order (1 or -1)
          acc[field] = order;
          return acc;
        }, {})
      : { name: 1 }; // Default to sorting by name in ascending order

    console.log('Sort Criteria:', sortCriteria);

    // Fetch the total count of matching documents
    const totalCount = await State.countDocuments(filterCriteria);

    // Fetch the states with pagination, projection, and sorting
    const states = await State.find(filterCriteria, projection)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limitNumber);

    // Cast `req.customReq` to `any` to allow adding `metadata`
    (req.customReq as any) = {
      statusCode: 200,
      data: states,
      message: 'States fetched successfully',
      metadata: {
        totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        pageSize: limitNumber,
      },
    };

    // Send the custom response using customReq
    res.json(req.customReq);
  } catch (err) {
    console.error('Error fetching states:', err);

    (req.customReq as any) = {
      statusCode: 500,
      data: null,
      message: `Error fetching states: ${err || err}`,
    };

    res.status(500).json(req.customReq); // Handle error with custom response
    next(err); // Pass errors to error handling middleware
  }
};

// Get state by ID with projection
export const getStateWithProjection = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;  // Get state ID from params

    if (!id) {
      req.customReq = {
        statusCode: 400,
        data: null,
        message: 'State ID is required.',
      };
      return next();
    }

    const state = await State.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),  // Match by state ID
          isDeleted: false  // Ensure the state is not deleted
        }
      }
    ]);

    if (!state || state.length === 0) {
      req.customReq = {
        statusCode: 404,
        data: null,
        message: 'State not found or already deleted.',
      };
      return next();
    }

    req.customReq = {
      statusCode: 200,
      data: state[0],  // Return the first state from the aggregation result
      message: 'State fetched successfully.',
    };
    next();  // Pass control to the next middleware or exit point
  } catch (err) {
    next(err);  // Pass any errors to error handling middleware
  }
};

// Add a new state
export const addState = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  // First, validate the name
  await body('name').isString().notEmpty().withMessage('Name is required').run(req);

  // Check validation result for name
  const nameResult = validationResult(req);
  if (!nameResult.isEmpty()) {
    req.customReq = {
      statusCode: 400,
      data: 'missing input parameters',
      message: 'Name is required and must be a non-empty string.',
    };
    return next();
  }

  // If name validation passes, move on to the next field (GDP)
  await body('gdp').isNumeric().withMessage('GDP must be a valid number').run(req);

  // Check validation result for GDP
  const gdpResult = validationResult(req);
  if (!gdpResult.isEmpty()) {
    req.customReq = {
      statusCode: 400,
      data: 'missing input parameters',
      message: 'GDP must be a valid number.',
    };
    return next();
  }

  // If all validations pass, proceed with adding the state
  try {
    const { name, country, population, capital, gdp } = req.body;

    const newState = new State({
      name,
      country,
      population,
      capital,
      gdp,
    });

    const savedState = await newState.save();

    req.customReq = {
      statusCode: 200,
      data: savedState,
      message: 'State added successfully.',
    };

    next();
  } catch (err) {
    req.customReq = {
      statusCode: 500,
      data: null,
      message: 'Failed to add state.',
    };
    next(err);
  }
};

// Get a single state by ID
export const getStateById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stateId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(stateId)) {
      req.customReq = {
        statusCode: 400,
        data: null,
        message: 'Invalid State ID format.',
      };
      return next();
    }

    const state = await State.findById(stateId);

    if (!state) {
      req.customReq = {
        statusCode: 404,
        data: null,
        message: 'State not found.',
      };
      return next();
    }

    if (state.isDeleted) {
      req.customReq = {
        statusCode: 400,
        data: null,
        message: 'State is deleted and cannot be fetched.',
      };
      return next();
    }

    req.customReq = {
      statusCode: 200,
      data: state,
      message: 'State fetched successfully.',
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


// Update a state
export const updateState = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
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

    // Find the state by ID and update the fields provided in the body
    const updatedState = await State.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedState) {
      req.customReq = {
        statusCode: 404,
        data: null,
        message: 'State not found.',
      };
      return next(); // Pass control to the next middleware (error handler)
    }

    req.customReq = {
      statusCode: 200,
      data: updatedState,
      message: 'State updated successfully.',
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
