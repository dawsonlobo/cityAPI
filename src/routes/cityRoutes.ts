import { Router } from 'express';
import { 
  getAllCities, 
  getCityById, 
  getCityWithProjection, 
  updateCity, 
  addCity 
} from '../controllers/cityController';
import { exitPoint } from '../middleware/exitPoint';
//import passport from 'passport';

const router = Router();

/**
 * @swagger
 * /cities/getAll:
 *   post:
 *     summary: Get all cities with pagination, filters, and projections
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *              projectionExample:
 *                summary: Example with projection
 *                value:
 *                  fields:
 *                    - name
 *                    - country
 *                    - population
 *              searchExample:
 *                summary: Example with search query
 *                value:
 *                  search: "New York"
 *              filterExample:
 *                summary: Example with filters
 *                value:
 *                  filters:
 *                    country: "India"
 *                    isDeleted: false
 *              paginationExample:
 *                summary: Example with pagination
 *                value:
 *                  page: 2
 *                  limit: 10
 *              sortExample:
 *                summary: Example with sorting
 *                value:
 *                  sort:
 *                    - field: "population"
 *                      order: -1
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *                 description: A search term to match the city name
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
 *         description: List of cities with metadata for pagination
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
 *                 cities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       country:
 *                         type: string
 *                       population:
 *                         type: integer
 *                       isDeleted:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 */
router.post('/getAll', getAllCities, exitPoint);




/**
 * @swagger
 * /cities/{id}/projection:
 *   post:
 *     summary: Get a city with projection
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the city
 *     responses:
 *       200:
 *         description: Details of the city with projection
 *         content:
 *           application/json:
 *             example:
 *               { "id": "1", "name": "City1", "state": "State1", "population": 500000 }
 */
router.post('/:id', getCityWithProjection, exitPoint);

/**
 * @swagger
 * /cities:
 *   post:
 *     summary: Add a new city
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               state:
 *                 type: string
 *               population:
 *                 type: number
 *     responses:
 *       201:
 *         description: City added successfully
 */
router.post('/', addCity, exitPoint);

/**
 * @swagger
 * /cities/{id}:
 *   get:
 *     summary: Get a city by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the city
 *     responses:
 *       200:
 *         description: Details of the city
 *         content:
 *           application/json:
 *             example:
 *               { "id": "1", "name": "City1", "state": "State1", "population": 500000 }
 *       404: 
 *          description: error
 */
router.get('/:id', getCityById, exitPoint);
// /**
//  * @swagger
//  * /cities/{id}:
//  *   get:
//  *     summary: Get city by ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the city to retrieve
//  *     responses:
//  *       200:
//  *         description: City details
//  *         content:
//  *           application/json:
//  *             example:
//  *               { "id": 1, "name": "City1" }
//  *       404:
//  *         description: City not found
//  */
// router.get('/:id', getCityById, exitPoint);

/**
 * @swagger
 * /cities/{id}:
 *   put:
 *     summary: Update a city's information
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the city
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               state:
 *                 type: string
 *               population:
 *                 type: number
 *     responses:
 *       200:
 *         description: City updated successfully
 */
router.put('/:id', updateCity, exitPoint);

export default router;
