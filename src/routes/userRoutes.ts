import e, { Router } from 'express';
import { 
  getAll,
  getOne,
  addUser,
  updateUser
} from '../controllers/userController';
import { exitPoint } from '../middleware/exitPoint';
import { authorizeAdmin } from '../middleware/role';
import passport from 'passport';

const router = Router();

/**
 * @swagger
 * /users/getAll:
 *   post:
 *     tags: ['users']
 *     security:
 *       - userAuth: []
 *     summary: Get all users with pagination, filters, projections, and sorting
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
 *                   - email
 *                   - role
 *             searchExample:
 *               summary: Example with search query
 *               value:
 *                 search: "John"
 *             filterExample:
 *               summary: Example with filters
 *               value:
 *                 filters:
 *                   role: "admin"
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
 *                   - field: "name"
 *                     order: 1
 *                   - field: "email"
 *                     order: -1
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *                 description: A search term to match the user name
 *               filters:
 *                 type: object
 *                 description: Filters for other fields (e.g., role)
 *               projections:
 *                 type: array
 *                 description: List of fields to include in the response (e.g., name, email, role)
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
 *                       description: The field to sort by (e.g., "name")
 *                     order:
 *                       type: integer
 *                       enum:
 *                         - 1
 *                         - -1
 *                       description: The sort order (1 for ascending, -1 for descending)
 *     responses:
 *       200:
 *         description: List of users with metadata for pagination
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
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       isDeleted:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 */
router.post('/getAll', 
  passport.authenticate('bearer', { session: false }),authorizeAdmin,getAll,exitPoint);

/**
 * @swagger
 * /users/{id}:
 *   post:
 *     summary: Get a user by ID
 *     tags: ['users']
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Details of the user
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "User data retrieved successfully.",
 *                 "data": {
 *                   "user": {
 *                     "_id": "603d9f205f8d2b3f5c87c0b0",
 *                     "name": "John Doe",
 *                     "email": "john@example.com",
 *                     "role": "admin"
 *                   }
 *                 }
 *               }
 *       400:
 *         description: Invalid user ID or missing required parameters
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id', passport.authenticate('bearer', { session: false }), getOne,authorizeAdmin,exitPoint);

/**
 * @swagger
 * /users:
 *   post:
 *     tags: ['users']
 *     security:
 *       - userAuth: []
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: number
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *           examples:
 *             userExample1:
 *               summary: Adding a user in the admin role
 *               value:
 *                 name: "Jane Smith"
 *                 phone: 9876543210
 *                 email: "jane@example.com"
 *                 password: "password123"
 *                 role: "admin"
 *     responses:
 *       201:
 *         description: User added successfully
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
 *                     phone:
 *                       type: number
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                 message:
 *                   type: string
 *             examples:
 *               successResponse:
 *                 summary: Successful user addition
 *                 value:
 *                   isSuccessful: true
 *                   data:
 *                     id: "63d88f5e6b7b3e001c27b112"
 *                     name: "Jane Smith"
 *                     phone: 9876543210
 *                     email: "jane@example.com"
 *                     role: "admin"
 *                   message: "User added successfully"
 */
router.post('/', passport.authenticate('bearer', { session: false }),authorizeAdmin, addUser,exitPoint);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: ['users']
 *     security:
 *       - userAuth: []
 *     summary: Update a user's information
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: integer
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               isDeleted:
 *                 type: boolean
 *           examples:
 *             userUpdateExample:
 *               summary: Updating user information with any field
 *               value:
 *                 name: "John Doe"
 *                 phone: 9876543210
 *                 email: "john.doe@example.com"
 *                 role: "user"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Example of successful user update
 *                 value:
 *                   message: "User updated successfully"
 */
router.put('/:id', passport.authenticate('bearer', { session: false }), authorizeAdmin,updateUser, exitPoint);

export default router;
