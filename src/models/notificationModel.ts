import mongoose, { Document, Schema } from "mongoose";

// Notification interface extending mongoose.Document for proper typing
export interface INotification extends Document {
  userid: mongoose.Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
  isDeleted: boolean;
  otherDetails: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
// Import the interface

const notificationSchema = new Schema<INotification>({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    default: "new state added",
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  otherDetails: {
    type: Object,
    default: {},
  },
}, {
  timestamps: true,
  versionKey: false,
});

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
