import { Router } from 'express';
import {
  getAllStates,
  getStateById,
  addState,
  updateState,
  deleteState,
} from '../controllers/stateController';

const router = Router();

/**
 * @swagger
 * /states/getall:
 *   post:
 *     tags: ['State API']
 *     summary: Retrieve all states
 *     requestBody:
 *       required: false
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
 *                 projection: 'name,capital'
 *                 id: ''
 *             example2:
 *               summary: Filter example
 *               value:
 *                 pagination:
 *                   page: '1'
 *                   limit: '10'
 *                 filter:
 *                   capital: 'Sacramento'
 *                   population: { $gt: 10000000 }
 *                 sort: ''
 *                 search: ''
 *                 projection: 'name,capital'
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
 *                 projection: 'name,capital'
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
 *                 projection: 'name,capital,population'
 *                 id: ''
 *             example5:
 *               summary: Search example
 *               value:
 *                 pagination:
 *                   page: '1'
 *                   limit: '10'
 *                 filter: {}
 *                 sort: ''
 *                 search: 'California'
 *                 projection: 'name,capital,population'
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
 *                 description: Filter criteria for querying states.
 *                 example: { capital: 'Sacramento', population: { $gt: 10000000 } }
 *               sort:
 *                 type: string
 *                 description: Sort order in the format `field:asc` or `field:desc`.
 *                 example: 'name:asc'
 *               search:
 *                 type: string
 *                 description: Search string to filter states by name.
 *                 example: 'California'
 *               projection:
 *                 type: string
 *                 description: Comma-separated list of fields to include or exclude. Use `-field` for exclusion.
 *                 example: 'name,capital'
 *               id:
 *                 type: string
 *                 description: State ID to fetch a specific state.
 *                 example: '63f2b5d6e3a4b2e34d123456'
 *     responses:
 *       200:
 *         description: Successfully retrieved list of states
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
 *                   description: Number of states per page.
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages.
 *                 totalStates:
 *                   type: integer
 *                   description: Total number of states available.
 *                 states:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Name of the state.
 *                         example: 'California'
 *                       capital:
 *                         type: string
 *                         description: Capital of the state.
 *                         example: 'Sacramento'
 *                       population:
 *                         type: integer
 *                         description: Population of the state.
 *                         example: 39538223
 */
router.post('/getall', getAllStates);

/**
 * @swagger
 * /states/{id}:
 *   post:
 *     tags: ['State API']
 *     summary: Retrieve a state by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the state to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved state
 *       404:
 *         description: State not found
 */
router.post('/:id', getStateById);

/**
 * @swagger
 * /states:
 *   post:
 *     tags: ['State API']
 *     summary: Add a new state
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             example1:
 *               summary: Add state details
 *               value:
 *                 name: "California"
 *                 population: 39538223
 *                 capital: "Sacramento"
 *                 gdp: 3136000
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the state
 *               population:
 *                 type: number
 *                 description: Population of the state
 *               capital:
 *                 type: string
 *                 description: Capital of the state
 *               gdp:
 *                 type: number
 *                 description: GDP of the state
 *     responses:
 *       201:
 *         description: State added successfully
 */
router.post('/', addState);

/**
 * @swagger
 * /states/{id}:
 *   put:
 *     tags: ['State API']
 *     summary: Update a state by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the state to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the state
 *               population:
 *                 type: number
 *                 description: Population of the state
 *               capital:
 *                 type: string
 *                 description: Capital of the state
 *               gdp:
 *                 type: number
 *                 description: GDP of the state
 *     responses:
 *       200:
 *         description: State updated successfully
 *       404:
 *         description: State not found
 */
router.put('/:id', updateState);

/**
 * @swagger
 * /states/{id}:
 *   delete:
 *     tags: ['State API']
 *     summary: Delete a state by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the state to delete
 *     responses:
 *       200:
 *         description: State deleted successfully
 *       404:
 *         description: State not found
 */
router.delete('/:id', deleteState);

export default router;
