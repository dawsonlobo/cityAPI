import { Router } from 'express';
import { 
  getAllCities, 
  getCityById, 
  getCityWithProjection, 
  updateCity, 
  addCity ,
  getAllstates,
  getstate,
  updateCitys

} from '../controllers/cityController';
import { exitPoint } from '../middleware/exitPoint';

const router = Router();

/**
 * @swagger
 * /cities/getAll:
 *   post:
 *     tags: ['cities'] 
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
router.post('/getAll', getAllCities, exitPoint);




/**
 * @swagger
 * /cities/{id}/:
 *   post:
 *     tags: ['cities'] 
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
 *     tags: ['cities'] 
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
router.post('/', addCity, exitPoint);


/**
 * @swagger
 * /cities/{id}:
 *   get:
 *     summary: Get a city by ID
 *     tags: ['cities'] 
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
 *     tags: ['cities'] 
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
router.put('/:id', updateCity, exitPoint);

/**
 * @swagger
 * /cities/{id}/stateDetails:
 *   get:
 *     tags: ['cities']
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
 *                 "stateDetails": {
 *                   "id": "60c72b2f9b1d8c3f8d07f1f0",
 *                   "name": "State1",
 *                   "country": "Country1",
 *                   "population": 2000000,
 *                   "gdp": 50000,
 *                   "capital": "Capital1"
 *                 }
 *               }
 *       404:
 *         description: City not found
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "City not found."
 *               }
 *       400:
 *         description: Invalid city ID format
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Invalid cityId format."
 *               }
 * 
 */
router.get('/:id/stateDetails',getstate, exitPoint);

/**
 * @swagger
 * /cities/state:
 *   post:
 *     tags: ['cities']
 *     summary: Get all cities with their state information
 *     responses:
 *       200:
 *         description: List of cities with state details
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "id": "1",
 *                   "name": "City1",
 *                   "stateDetails": {
 *                     "id": "10",
 *                     "name": "State1",
 *                     "country": "Country1",
 *                     "population": 2000000,
 *                     "gdp": 50000
 *                   },
 *                   "population": 500000
 *                 },
 *                 {
 *                   "id": "2",
 *                   "name": "City2",
 *                   "stateDetails": {
 *                     "id": "20",
 *                     "name": "State2",
 *                     "country": "Country2",
 *                     "population": 1000000,
 *                     "gdp": 30000
 *                   },
 *                   "population": 300000
 *                 }
 *               ]
 */
router.post('/state',getAllstates, exitPoint);
/**
* @swagger
* /cities/{id}/updateJoin:
*   put:
*     tags: ['cities']
*     summary: Update a city's information and its associated state details
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the city to update
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               city:
*                 type: object
*                 properties:
*                   name:
*                     type: string
*                     description: The name of the city
*                   population:
*                     type: number
*                     description: The population of the city
*               stateId:
*                 type: string
*                 description: The ObjectId of the state that the city belongs to
*           examples:
*             updateExample:
*               summary: Example update for city and state
*               value:
*                 city:
*                   name: "Updated City"
*                   population: 600000
*                 stateId: "64f0923abcd123456789abcd"
*     responses:
*       200:
*         description: City updated successfully
*         content:
*           application/json:
*             example:
*               {
*                 "message": "City updated successfully",
*                 "updatedCity": {
*                   "id": "1",
*                   "name": "Updated City",
*                   "stateId": "64f0923abcd123456789abcd",
*                   "population": 600000
*                 }
*               }
*       400:
*         description: Invalid stateId provided
*         content:
*           application/json:
*             example:
*               {
*                 "message": "Invalid stateId provided."
*               }
*       404:
*         description: City not found
*         content:
*           application/json:
*             example:
*               {
*                 "message": "City not found."
*               }
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             example:
*               {
*                 "message": "Error updating city",
*                 "error": "Detailed error message"
*               }
* 
*/

router.put('/:id/updateJoin', updateCitys, exitPoint);



export default router;
