import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import State from '../models/stateModel'; // Assuming you have a model called State
import { CustomRequest } from '../interfaces/customRequest'; // Importing the custom request interface

 // Import CustomRequest

// Get all states with optional pagination, sorting, and filters
// export const getAllStates = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { search, filters, fields, page = 1, limit = 10, sort } = req.body;

//     console.log('Received request body: ' + JSON.stringify(req.body));
    
//     // Sanitize and validate pagination parameters
//     const pageNumber = Math.max(1, parseInt(page as any)); // Ensure page is at least 1
//     const limitNumber = Math.max(1, parseInt(limit as any)); // Ensure limit is at least 1
    
//     // Build the search criteria for state names
//     const searchCriteria = search ? { name: { $regex: search, $options: 'i' } } : {};
    
//     // Combine search and filter criteria
//     const filterCriteria = { ...searchCriteria, ...filters };

//     // Build the projection object to include only specified fields
//     const projection = Array.isArray(fields)
//       ? fields.reduce((acc: any, field: string) => {
//           acc[field] = 1;
//           return acc;
//         }, { _id: 0 }) 
//       : { _id: 0 }; // Default to excluding _id if no fields are provided

//     // Calculate the number of documents to skip for pagination
//     const skip = (pageNumber - 1) * limitNumber;

//     // Use the provided sort criteria or default to sorting by 'name'
//     const sortCriteria = sort && Array.isArray(sort) 
//       ? sort.reduce((acc: any, item: any) => {
//           const field = item[0]; // field name (e.g., "population")
//           const order = item[1]; // sort order (1 or -1)
//           acc[field] = order;
//           return acc;
//         }, {})
//       : { name: 1 }; // Default to sorting by name in ascending order

//     // Fetch the total count of matching documents
//     const totalCount = await State.countDocuments(filterCriteria);
    
//     // Fetch the states with pagination, projection, and sorting
//     const states = await State.find(filterCriteria, projection)
//       .sort(sortCriteria)
//       .skip(skip)
//       .limit(limitNumber);

//     // Store the response data in customReq
//     req.customReq = {
//       isSuccessful: true,
//       data: states,
//       message: 'States fetched successfully',
//     };

//     // Send the custom response using customReq
//     res.json(req.customReq);
//   } catch (err) {
//     req.customReq = {
//       isSuccessful: false,
//       data: null,
//       message: `Error fetching states: ${err}`,
//     };
//     res.status(500).json(req.customReq); // Handle error with custom response
//     next(err); // Pass errors to error handling middleware
//   }
// };
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
        isSuccessful: true,
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
      // Log the error for debugging
      console.error('Error fetching states:', err);
  
      (req.customReq as any) = {
        isSuccessful: false,
        data: null,
        message: `Error fetching states: ${err|| err}`,
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
        isSuccessful: false,
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
        isSuccessful: false,
        data: null,
        message: 'State not found or already deleted.',
      };
      return next();
    }

    req.customReq = {
      isSuccessful: true,
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
  try {
    // Destructure the required fields directly from the request body
    const { name, country, population, capital } = req.body;
  
    // Create a new State instance with the provided data
    const newState = new State({
      name,
      country,
      population,
      capital,
    });
  
    // Save the state to the database
    const savedState = await newState.save();
  
    // Set customReq with success status, message, and saved data
    req.customReq = {
      isSuccessful: true,
      data: savedState,
      message: 'State added successfully.',
    };
  
    // If customReq is set, handle the response using exitPoint or similar middleware
    next();  // Pass control to the next middleware (usually the exitPoint)
  } catch (err) {
    req.customReq = {
      isSuccessful: false,
      data: null,
      message: 'Failed to add state.',
    };
    next(err);  // Pass the error to error handling middleware
  }
};

// Get a single state by ID
export const getStateById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stateId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(stateId)) {
      req.customReq = {
        isSuccessful: false,
        data: null,
        message: 'Invalid State ID format.',
      };
      return next();
    }

    const state = await State.findById(stateId);

    if (!state) {
      req.customReq = {
        isSuccessful: false,
        data: null,
        message: 'State not found.',
      };
      return next();
    }

    req.customReq = {
      isSuccessful: true,
      data: state,
      message: 'State fetched successfully.',
    };
    next();
  } catch (err) {
    req.customReq = {
      isSuccessful: false,
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
        isSuccessful: false,
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
        isSuccessful: false,
        data: null,
        message: 'State not found.',
      };
      return next(); // Pass control to the next middleware (error handler)
    }

    req.customReq = {
      isSuccessful: true,
      data: updatedState,
      message: 'State updated successfully.',
    };
    next(); // Proceed to the next middleware (success handler)
  } catch (err) {
    req.customReq = {
      isSuccessful: false,
      data: null,
      message: 'Something went wrong!',
    };
    next(err); // Pass error to error-handling middleware
  }
};

// Delete a state (soft delete)
export const deleteState = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedState = await State.findByIdAndUpdate(
      req.params.id, 
      { isDeleted: true }, // Soft delete by setting isDeleted to true
      { new: true }
    );

    if (!deletedState) {
      req.customReq = {
        isSuccessful: false,
        data: null,
        message: 'State not found.',
      };
      return next();
    }

    req.customReq = {
      isSuccessful: true,
      data: null,
      message: 'State deleted successfully.',
    };
    next(); // Pass control to the next middleware or exit point
  } catch (err) {
    req.customReq = {
      isSuccessful: false,
      data: null,
      message: 'Something went wrong!',
    };
    next(err); // Pass errors to error handling middleware
  }
};
