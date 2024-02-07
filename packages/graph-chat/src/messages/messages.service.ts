import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message, MessageDocument } from "./message.model";
import { Room, RoomDocument } from "../rooms/room.model";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>
  ) {}

  async findAll(): Promise<Message[]> {
    return this.messageModel.find()
      .populate('user')
      .populate('room')
      .exec();
  }

  async findOne(id: string): Promise<Message> {
    return this.messageModel.findById(id)
      .populate('user')
      .populate('room')
      .exec();
  }

  async create(message: Message): Promise<Message> {
    const { room } = message;
    const newMessage = new this.messageModel(message);
    const createdMessage = await newMessage.save();

    await this.roomModel.findByIdAndUpdate
      (room, { $push: { messages: createdMessage.id } });

    const populatedMessage = await this.messageModel.findById(createdMessage.id)
      .populate('user')
      .populate('room')
      .exec();

    return populatedMessage;
  }
}