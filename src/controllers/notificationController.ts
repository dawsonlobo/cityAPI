import { Request, Response } from "express";
import mongoose from "mongoose";
import Notification, { INotification } from "../models/notificationModel";

// Named exports for the controller functions
export const getOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const notification = await Notification.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id), isDeleted: false },
      },
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          message: 1,
          isRead: 1,
          isDeleted: 1,
          createdAt: 1,
          updatedAt: 1,
          "userDetails.name": 1,
        },
      },
    ]);

    if (!notification || notification.length === 0) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }

    res.status(200).json({
      message: "Notification retrieved successfully",
      data: notification[0],
    });
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(400).json({ message: "Internal server error", error });
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;
    const filter: { isDeleted: boolean; userid?: mongoose.Types.ObjectId } = { isDeleted: false };

    if (userId) filter.userid = new mongoose.Types.ObjectId(userId as string);

    const notifications: INotification[] = await Notification.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          message: 1,
          isRead: 1,
          isDeleted: 1,
          createdAt: 1,
          updatedAt: 1,
          "userDetails.name": 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(400).json({ message: "Internal server error", error });
  }
};



// Update many notifications by passing an array of IDs
export const updateMany = async (req: Request, res: Response): Promise<void> => {
  try {
    // Assuming the array of IDs and fields to update are passed in the request body
    const { ids, updateFields } = req.body;

    // Ensure that 'ids' is an array of ObjectIds
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ message: "Invalid or empty array of IDs." });
    }

    const objectIds = ids.map((id: string) => new mongoose.Types.ObjectId(id));

    // Perform the updateMany operation
    const result = await Notification.updateMany(
      { _id: { $in: objectIds }, isDeleted: false }, // Matching the provided IDs
      { $set: updateFields } // Update the specified fields
    );

    // Check if any documents were modified
    if (result.modifiedCount === 0) {
       res.status(404).json({ message: "No notifications were updated." });
    }

    res.status(200).json({
      message: `${result.modifiedCount} notifications updated successfully.`,
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(400).json({ message: "Internal server error", error });
  }
};
