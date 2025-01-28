import { Router } from 'express';
import { exitPoint } from '../middleware/exitPoint';
import { getOne, getAll ,updateMany} from "../controllers/notificationController";
import { authorizeAdmin } from '../middleware/role';
import passport from 'passport';

const router = Router();

/**
 * @swagger
 * /notifications/{id}:
 *   post:
 *     tags: ['notifications']
 *     security:
 *       - userAuth: []
 *     summary: Get a notification by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 */
router.post('/:id', 
  passport.authenticate('bearer', { session: false }),
  authorizeAdmin,
  getOne,
  exitPoint
);

/**
 * @swagger
 * /notifications/getAll:
 *   post:
 *     tags: ['notifications']
 *     security:
 *       - userAuth: []
 *     summary: Get all notifications with optional projections
 *     description: Retrieves a list of all notifications with optional filtering by user ID and projection to include/exclude fields in the response.
 *     requestBody:
 *       description: Optional filtering and projection criteria
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Optional user ID to filter notifications
 *               projection:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: boolean
 *                     description: Include or exclude the _id field (true to include, false to exclude)
 *                     example: true
 *                   title:
 *                     type: boolean
 *                     description: Include or exclude the title field
 *                     example: true
 *                   message:
 *                     type: boolean
 *                     description: Include or exclude the message field
 *                     example: true
 *                   isRead:
 *                     type: boolean
 *                     description: Include or exclude the isRead field
 *                     example: false
 *                   createdAt:
 *                     type: boolean
 *                     description: Include or exclude the createdAt field
 *                     example: true
 *             example:
 *               userId: "607c191e810c19729de860ea"
 *               projection:
 *                 _id: true
 *                 title: true
 *                 message: true
 *                 isRead: false
 *                 createdAt: true
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notifications retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "607c191e810c19729de860ea"
 *                       title:
 *                         type: string
 *                         example: "New Notification"
 *                       message:
 *                         type: string
 *                         example: "You have a new message."
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-28T12:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-28T12:30:00Z"
 *                       userDetails:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *       400:
 *         description: Bad request, invalid parameters.
 *       500:
 *         description: Internal server error
 */
router.get('/getAll', 
    passport.authenticate('bearer', { session: false }),
    authorizeAdmin,
    getAll,
    exitPoint
  );
  
/**
 * @swagger
 * /notifications/update-many:
 *   put:
 *     tags: ['notifications']
 *     security:
 *       - userAuth: []
 *     summary: Update many notifications by passing an array of IDs
 *     description: Updates multiple notifications based on the provided IDs and the update fields.
 *     requestBody:
 *       description: IDs and fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of notification IDs to update
 *               updateFields:
 *                 type: object
 *                 properties:
 *                   isRead:
 *                     type: boolean
 *                   message:
 *                     type: string
 *                   title:
 *                     type: string
 *                 description: The fields to update in the notifications
 *     responses:
 *       200:
 *         description: Notifications updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "3 notifications updated successfully."
 *       400:
 *         description: Invalid or empty array of IDs
 *       404:
 *         description: No notifications were updated
 *       500:
 *         description: Internal server error
 */
router.put('/update-many',
    passport.authenticate('bearer', { session: false }),
    authorizeAdmin,
    updateMany,
    exitPoint
  );
  
export default router;