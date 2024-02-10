import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Notification, NotificationDocument } from "./notification.model";

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async findAll(receiverId: string, limit: number): Promise<Notification[]> {
    return this.notificationModel.find({ receiver: receiverId, read: false })
      .sort({ createdAt: -1 }) 
      .limit(limit)
      .populate('receiver')
      .exec();
  }

  async create(notification: Notification): Promise<Notification> {
    const newNotification = new this.notificationModel(notification);
    await newNotification.save();
    return this.notificationModel.findById(newNotification.id).populate('receiver').exec();
  }

  async readMany(ids: string[]): Promise<void> {
    await this.notificationModel.updateMany({ _id: { $in: ids } }, { read: true });
  }
}