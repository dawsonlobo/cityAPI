import { Router } from 'express';
import {
  getAllStates,
  getStateById,
  addState,
  updateState
} from '../controllers/stateContoller';
import { exitPoint } from '../middleware/exitPoint';

const router = Router();

/**
 * @swagger
 * /states/getAll:
 *   post:
 *     tags: ['states']
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
 */
router.post('/getAll', getAllStates, exitPoint);


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
 */
router.post('/', addState, exitPoint);


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
 */
router.put('/:id', updateState, exitPoint);

export default router;
