import User from '../models/userModel';
import Notification from '../models/notificationModel';

export const notifyAdminsAboutState = async (stateDetails: any, userName: string): Promise<void> => {
  try {
    // Fetch all admin users
    const admins = await User.find({ role: 'admin' });

    // Prepare the notification message
    const message = `${userName} has added a new state: ${stateDetails.name}`;

    // Create a new notification for each admin
    for (const admin of admins) {
      const newNotification = new Notification({
        userid: admin._id,
        message,
        title: 'New state added',
        isRead: false,
        isDeleted: false,
        otherDetails: { stateId: stateDetails._id },  // Include stateId in otherDetails
      });

      // Save the notification
      await newNotification.save();
    }
  } catch (err) {
    console.error('Error notifying admins:', err);
  }
};
