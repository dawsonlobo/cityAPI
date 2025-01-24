import { Router } from 'express';
import { 
  getAllCities, 
  getCityById, 
  getCityWithProjection, 
  updateCity, 
  addCity,
  getAllstates,
  getstate,
  updateCitys
} from '../controllers/cityController';
import { exitPoint } from '../middleware/exitPoint';
import passport from 'passport';

const router = Router();

/**
 * @swagger
 * /cities/getAll:
 *   post:
 *     tags: ['cities'] 
 *     security:
 *       - userAuth: []
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
 *                      field: "population"
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
router.post('/getAll',
  passport.authenticate('bearer', { session: false }), getAllCities, exitPoint);


/**
 * @swagger
 * /cities/{id}/:
 *   post:
 *     tags: ['cities'] 
 *     security:
 *       - userAuth: []
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
router.post('/:id',
  passport.authenticate('bearer', { session: false }), getCityWithProjection, exitPoint);


/**
 * @swagger
 * /cities:
 *   post:
 *     tags: ['cities'] 
 *     security:
 *       - userAuth: []
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
 *           examples:
 *             cityExample1:
 *               summary: Adding a city in the USA
 *               value:
 *                 name: "San Francisco"
 *                 state: "California"
 *                 population: 883305
 *             cityExample2:
 *               summary: Adding a city in India
 *               value:
 *                 name: "Mumbai"
 *                 state: "Maharashtra"
 *                 population: 20411274
 *     responses:
 *       201:
 *         description: City added successfully
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
 *                     state:
 *                       type: string
 *                     population:
 *                       type: number
 *                 message:
 *                   type: string
 *             examples:
 *               successResponse:
 *                 summary: Successful city addition
 *                 value:
 *                   isSuccessful: true
 *                   data:
 *                     id: "63d88f5e6b7b3e001c27b112"
 *                     name: "San Francisco"
 *                     state: "California"
 *                     population: 883305
 *                   message: "City added successfully"
 *               errorResponse:
 *                 summary: Error example
 *                 value:
 *                   isSuccessful: false
 *                   data: null
 *                   message: "City already exists"
 */
router.post('/',passport.authenticate('bearer', { session: false }), addCity, exitPoint);


/**
 * @swagger
 * /cities/{id}:
 *   get:
 *     summary: Get a city by ID
 *     tags: ['cities'] 
 *     security:
 *       - userAuth: []
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
router.get('/:id',passport.authenticate('bearer', { session: false }), getCityById, exitPoint);


/**
 * @swagger
 * /cities/{id}:
 *   put:
 *     tags: ['cities'] 
 *     security:
 *       - userAuth: []
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
 *           examples:
 *             cityUpdateExample:
 *               summary: Updating city information
 *               value:
 *                 name: "New York"
 *                 country: "New York"
 *                 population: 8419600
 *             cityUpdateExample2:
 *               summary: Update with deletion flag
 *               value:
 *                 isDeleted: true
 *     responses:
 *       200:
 *         description: City updated successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Example of successful city update
 *                 value:
 *                   message: "City updated successfully"
 */
router.put('/:id',passport.authenticate('bearer', { session: false }), updateCity, exitPoint);

/**
 * @swagger
 * /cities/{id}/stateDetails:
 *   get:
 *     tags: ['cities']
 *     security:
 *       - userAuth: []
 *     summary: Get city details along with its state details
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the city
 *     responses:
 *       200:
 *         description: City details with state information
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "id": "67920b929150bbf9ff76e336",
 *                 "name": "City1",
 *                 "population": 500000,
 *                 "state": "State1"
 *               }
 */
router.get('/:id/stateDetails', getstate, exitPoint);

/**
 * @swagger
 * /cities/stateDetails:
 *   get:
 *     tags: ['cities']
 *     security:
 *       - userAuth: []
 *     summary: Get all cities with their state details
 *     responses:
 *       200:
 *         description: All cities with state details
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "id": "67920b929150bbf9ff76e336",
 *                   "name": "City1",
 *                   "population": 500000,
 *                   "state": "State1"
 *                 },
 *                 {
 *                   "id": "67920b929150bbf9ff76e337",
 *                   "name": "City2",
 *                   "population": 1000000,
 *                   "state": "State2"
 *                 }
 *               ]
 */
router.get('/cities/stateDetails', getAllstates, exitPoint);


/**
 * @swagger
 * /cities/{id}/updateJoin:
 *   put:
 *     tags: ['cities'] 
 *     security:
 *       - userAuth: []
 *     summary: Update city and state details together
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
 *         description: City and state details updated successfully
 *         content:
 *           application/json:
 *             example:
 *               { "message": "City and state details updated successfully" }
 */
router.put('/:id/updateJoin',passport.authenticate('bearer', { session: false }), updateCitys, exitPoint);

export default router;
