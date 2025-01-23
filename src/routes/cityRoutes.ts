import { Router } from 'express';
import {
  getAllCities,
  getCityById,
  addCity,
  updateCity,
  deleteCity,
} from '../controllers/cityController';

const router = Router();

/**
 * @swagger
 * /cities/getall:
 *   post:
 *     tags: ['City API']
 *     summary: Retrieve all cities
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             example1:
 *               summary: Pagination example
 *               value:
 *                 pagination:
 *                   page: '1'
 *                   limit: '10'
 *                 filter: {}
 *                 sort: ''
 *                 search: ''
 *                 projection: 'name,country'
 *                 id: ''
 *             example2:
 *               summary: Filter example
 *               value:
 *                 pagination:
 *                   page: '1'
 *                   limit: '10'
 *                 filter:
 *                   country: 'India'
 *                   population: { $gt: 1000000 }
 *                 sort: ''
 *                 search: ''
 *                 projection: 'name,country'
 *                 id: ''
 *             example3:
 *               summary: Sort example
 *               value:
 *                 pagination:
 *                   page: '1'
 *                   limit: '10'
 *                 filter: {}
 *                 sort: 'name:asc'
 *                 search: ''
 *                 projection: 'name,country'
 *                 id: ''
 *             example4:
 *               summary: Projection example
 *               value:
 *                 pagination:
 *                   page: '1'
 *                   limit: '10'
 *                 filter: {}
 *                 sort: ''
 *                 search: ''
 *                 projection: 'name,country,population'
 *                 id: ''
 *             example5:
 *               summary: Search example
 *               value:
 *                 pagination:
 *                   page: '1'
 *                   limit: '10'
 *                 filter: {}
 *                 sort: ''
 *                 search: 'New Delhi'
 *                 projection: 'name,country,population'
 *                 id: ''
 *           schema:
 *             type: object
 *             properties:
 *               pagination:
 *                 type: object
 *                 description: Pagination settings.
 *                 properties:
 *                   page:
 *                     type: string
 *                     example: '1'
 *                   limit:
 *                     type: string
 *                     example: '10'
 *               filter:
 *                 type: object
 *                 description: Filter criteria for querying cities.
 *                 example: { country: 'India', population: { $gt: 1000000 } }
 *               sort:
 *                 type: string
 *                 description: Sort order in the format `field:asc` or `field:desc`.
 *                 example: 'name:asc'
 *               search:
 *                 type: string
 *                 description: Search string to filter cities by name.
 *                 example: 'New'
 *               projection:
 *                 type: string
 *                 description: Comma-separated list of fields to include or exclude. Use `-field` for exclusion.
 *                 example: 'name,country'
 *               id:
 *                 type: string
 *                 description: City ID to fetch a specific city.
 *                 example: '63f2b5d6e3a4b2e34d123456'
 *     responses:
 *       200:
 *         description: Successfully retrieved list of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: Current page number.
 *                 limit:
 *                   type: integer
 *                   description: Number of cities per page.
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages.
 *                 totalCities:
 *                   type: integer
 *                   description: Total number of cities available.
 *                 cities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Name of the city.
 *                         example: 'New Delhi'
 *                       country:
 *                         type: string
 *                         description: Country of the city.
 *                         example: 'India'
 *                       population:
 *                         type: integer
 *                         description: Population of the city.
 *                         example: 20000000
 */
router.post('/getall', getAllCities);

/**
 * @swagger
 * /cities/{id}:
 *   post:
 *     tags: ['City API']
 *     summary: Retrieve a city by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the city to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved city
 *       404:
 *         description: City not found
 */
router.post('/:id', getCityById);

/**
 * @swagger
 * /cities:
 *   post:
 *     tags: ['City API']
 *     summary: Add a new city
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             example1:
 *               summary: Update city details
 *               value:
 *                 name: ""
 *                 population: 
 *                 country: ""
 *                 latitude: "123.456"
 *                 longitude: "78.910"
 *                 stateId: "NY"
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the city
 *               population:
 *                 type: number
 *                 description: Population of the city
 *     responses:
 *       201:
 *         description: City added successfully
 */
router.post('/', addCity);

/**
 * @swagger
 * /cities/{id}:
 *   put:
 *     tags: ['City API']
 *     summary: Update a city by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the city to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the city
 *               population:
 *                 type: number
 *                 description: Population of the city
 *     responses:
 *       200:
 *         description: City updated successfully
 *       404:
 *         description: City not found
 */
router.put('/:id', updateCity);

/**
 * @swagger
 * /cities/{id}:
 *   delete:
 *     tags: ['City API']
 *     summary: Delete a city by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the city to delete
 *     responses:
 *       200:
 *         description: City deleted successfully
 *       404:
 *         description: City not found
 */
router.delete('/:id', deleteCity);

export default router;
