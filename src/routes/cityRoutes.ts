import { Router } from 'express';
import { 
 getAll,
 getOne,
 addCity,
 updateCity
} from '../controllers/cityController';
import { exitPoint } from '../middleware/exitPoint';
import passport from 'passport';

const router = Router()/**

/**
 * @swagger
 * /cities/getAll:
 *   post:
 *     tags: ['cities']
 *     security:
 *       - userAuth: []
 *     summary: Get all cities with pagination, filters, projections, and sorting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             projectionExample:
 *               summary: Example with projections
 *               value:
 *                 projections:
 *                   - name
 *                   - country
 *                   - population
 *             searchExample:
 *               summary: Example with search query
 *               value:
 *                 search: "New York"
 *             filterExample:
 *               summary: Example with filters
 *               value:
 *                 filters:
 *                   country: "India"
 *                   isDeleted: false
 *             paginationExample:
 *               summary: Example with pagination
 *               value:
 *                 page: 2
 *                 limit: 10
 *             sortExample:
 *               summary: Example with sorting
 *               value:
 *                 sort:
 *                   - field: "population"
 *                     order: -1
 *                   - field: "name"
 *                     order: 1
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *                 description: A search term to match the city name
 *               filters:
 *                 type: object
 *                 description: Filters for other fields (e.g., country)
 *               projections:
 *                 type: array
 *                 description: List of fields to include in the response (e.g., name, country, population)
 *                 items:
 *                   type: string
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
 *                 description: Sorting criteria with field and order (can be multiple fields)
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
  passport.authenticate('bearer', { session: false }), getAll, exitPoint);

/**
* @swagger
* /cities/{id}:
*   post:
*     summary: Get a city by ID along with lookup from the states collection
*     tags: ['cities']
*     security:
*       - userAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the city to retrieve
*     responses:
*       200:
*         description: Details of the city with state lookup
*         content:
*           application/json:
*             example:
*               {
*                 "message": "City data retrieved successfully.",
*                 "data": {
*                   "city": {
*                     "_id": "603d9f205f8d2b3f5c87c0b0",
*                     "name": "New York",
*                     "population": 8419600,
*                     "stateDetails": {
*                       "name": "New York",
*                       "country": "USA"
*                     }
*                   }
*                 }
*               }
*       400:
*         description: Invalid city ID or missing required parameters
*       404:
*         description: City not found
*       500:
*         description: Internal server error
*/
router.post('/:id', passport.authenticate('bearer', { session: false }), getOne, exitPoint);



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
*               country:
*                 type: string
*               population:
*                 type: number
*           examples:
*             cityExample1:
*               summary: Adding a city in the USA
*               value:
*                 name: "San Francisco"
*                 country: "California"
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
*                     country:
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
*                     country: "California"
*                     population: 883305
*                   message: "City added successfully"
*/
router.post('/', passport.authenticate('bearer', { session: false }), addCity, exitPoint);

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
*               country:
*                 type: string
*               population:
*                 type: number
*               stateId:
*                 type: string
*               isDelete:
*                 type: boolean
*           examples:
*             cityUpdateExample:
*               summary: Updating city information with any field
*               value:
*                 name: "New York"
*                 country: "New York"
*                 population: 8419600
*             cityUpdateWithStateExample:
*               summary: Updating city information with stateId check
*               value:
*                 stateId: "5f50b4f9b3d1f2b3d8c0e5ef"
*             cityDeleteExample:
*               summary: Updating city's delete status
*               value:
*                 isDeleted: true
*     responses:
*       200:
*         description: City updated successfully
*         content:
*           application/json:
*             examples:
*               success:
*                 summary: Example of successful city update with different conditions
*                 value:
*                   message: "City updated successfully"
*/
router.put('/:id', passport.authenticate('bearer', { session: false }), updateCity, exitPoint);



export default router;
