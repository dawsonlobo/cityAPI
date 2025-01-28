import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  getAllStates,
  getStateById,
  addState,
  updateState
} from '../controllers/stateController';
import { validateRequest } from '../middleware/validateRequest';
import { exitPoint } from '../middleware/exitPoint';
import passport from 'passport';

const router = Router();

/**
 * @swagger
 * /states/getAll:
 *   post:
 *     tags: ['states']
 *     security:
 *       - userAuth: []
 *     summary: Get all states with pagination, filters, and projections
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             projectionExample:
 *               summary: Example with projection
 *               value:
 *                 projections:
 *                   - name
 *                   - population
 *                   - gdp
 *                   - capital
 *             searchExample:
 *               summary: Example with search query
 *               value:
 *                 search: "California"
 *             filterExample:
 *               summary: Example with filters
 *               value:
 *                 filters:
 *                   name: "karnataka"
 *             paginationExample:
 *               summary: Example with pagination
 *               value:
 *                 page: 2
 *                 limit: 10
 *             sortExample:
 *               summary: Example with sorting
 *               value:
 *                 sort:
 *                   - ["population", -1]
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *                 description: A search term to match the state name
 *               filters:
 *                 type: object
 *                 description: Filters for other fields (e.g., country)
 *               fields:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of fields to include in the response
 *               page:
 *                 type: integer
 *                 default: 1
 *                 description: Page number for pagination
 *               limit:
 *                 type: integer
 *                 default: 10
 *                 description: Number of items per page
 *               sort:
 *                 type: array
 *                 description: An array of sorting criteria, each with a field and order
 *                 items:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                       description: The field to sort by (e.g., "population")
 *                     order:
 *                       type: integer
 *                       enum:
 *                         - 1
 *                         - -1
 *                       description: The sort order (1 for ascending, -1 for descending)
 *     responses:
 *       200:
 *         description: List of states with metadata for pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                 states:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       population:
 *                         type: integer
 *                       gdp:
 *                         type: number
 *                       capital:
 *                         type: string
 *                       isDeleted:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *           401:
 *              description: Unauthorized - Invalid token
 */       
router.post('/getAll', 
  passport.authenticate('bearer', { session: false }),
  getAllStates, exitPoint);


/**
 * @swagger
 * /states/{id}:
 *   get:
 *     summary: Get a state by ID
 *     tags: ['states']
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the state
 *     responses:
 *       200:
 *         description: Details of the state
 *         content:
 *           application/json:
 *             example:
 *               { "id": "1", "name": "California", "country": "USA", "population": 39538223, "gdp": 3200000, "capital": "Sacramento" }
 *       404:
 *         description: State not found
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.get('/:id', getStateById, exitPoint);


/**
 * @swagger
 * /states:
 *   post:
 *     tags: ['states']
 *     summary: Add a new state
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               population:
 *                 type: number
 *               gdp:
 *                 type: number
 *               capital:
 *                 type: string
 *           examples:
 *             stateExample1:
 *               summary: Adding a state in the USA
 *               value:
 *                 name: "California"
 *                 population: 39538223
 *                 gdp: 3200000
 *                 capital: "Sacramento"
 *             stateExample2:
 *               summary: Adding a state in India
 *               value:
 *                 name: "Maharashtra"
 *                 population: 112374333
 *                 gdp: 4000000
 *                 capital: "Mumbai"
 *     responses:
 *       201:
 *         description: State added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccessful:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     country:
 *                       type: string
 *                     population:
 *                       type: number
 *                     gdp:
 *                       type: number
 *                     capital:
 *                       type: string
 *                 message:
 *                   type: string
 *             examples:
 *               successResponse:
 *                 summary: Successful state addition
 *                 value:
 *                   isSuccessful: true
 *                   data:
 *                     id: "63d88f5e6b7b3e001c27b113"
 *                     name: "Karnataka"
 *                     capital: "Bengaluru"
 *                     population: 39538223
 *                     gdp: 3500000
 *                   message: "State added successfully"
 *               errorResponse:
 *                 summary: Error example
 *                 value:
 *                   isSuccessful: false
 *                   data: null
 *                   message: "State already exists"
 *       401:
 *         description: Unauthorized - Invalid token
 */  
router.post(
  '/',passport.authenticate('bearer', { session: false }),
  [
    body('name')
      .trim()
      .isString()
      .notEmpty()
      .withMessage('Name is required and must be a non-empty string'),

    body('population')
      .isInt({ min: 1 })
      .withMessage('Population must be an integer greater than 0'),

    body('gdp')
      .isNumeric()
      .isFloat({ min: 0 }) // GDP must be non-negative
      .withMessage('GDP must be a valid non-negative number'),

    body('capital')
      .trim()
      .isString()
      .notEmpty()
      .withMessage('Capital is required and must be a non-empty string'),
  ],
  validateRequest,  // Validate input before proceeding to the next middleware
  addState,         // Proceed with adding state if validation passes
  exitPoint         // Send response based on state after adding state
);


/**
 * @swagger
 * /states/{id}:
 *   put:
 *     tags: ['states']
 *     summary: Update a state's information
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the state
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               population:
 *                 type: number
 *               gdp:
 *                 type: number
 *               capital:
 *                 type: string
 *           examples:
 *             stateUpdateExample:
 *               summary: Updating state information
 *               value:
 *                 name: "Karnataka"
 *                 population: 39538223
 *                 gdp: 3500000
 *                 capital: "Bengaluru"
 *     responses:
 *       200:
 *         description: State updated successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Example of successful state update
 *                 value:
 *                   message: "State updated successfully"
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.put(
  '/:id',
  [
    // Validate the `id` parameter (ensure it is a valid ObjectId)
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format'),

    // Validate `name` (optional)
    body('name')
      .optional()
      .trim()
      .isString()
      .notEmpty()
      .withMessage('Name must be a non-empty string'),

    // Validate `country` (optional)
    body('country')
      .optional()
      .trim()
      .isString()
      .notEmpty()
      .withMessage('Country must be a non-empty string'),

    // Validate `population` (optional)
    body('population')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Population must be an integer greater than 0'),

    // Validate `gdp` (optional)
    body('gdp')
      .optional()
      .isNumeric()
      .isFloat({ min: 0 }) // Ensure GDP is non-negative
      .withMessage('GDP must be a valid non-negative number'),

    // Validate `capital` (optional)
    body('capital')
      .optional()
      .trim()
      .isString()
      .notEmpty()
      .withMessage('Capital must be a non-empty string'),
  ],
  validateRequest,  // Custom middleware to handle validation errors
  updateState,      // Actual logic for updating the state
  exitPoint         // Send final response (success/error)
);

export default router;
