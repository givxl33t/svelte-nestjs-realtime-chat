import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message, MessageDocument } from "./message.model";
import { Room, RoomDocument } from "../rooms/room.model";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
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

  async create(roomId: string, messengerId: string, messageText: string): Promise<Message> {
    const newMessage = new this.messageModel({
      room: roomId,
      user: messengerId,
      text: messageText
    
    });
    const createdMessage = await newMessage.save();

    await this.roomModel.findByIdAndUpdate
      (roomId, { $push: { messages: createdMessage.id } }).populate('users').exec();

    return this.messageModel.findById(createdMessage.id)
      .populate('user')
      .populate('room')
      .exec();
  }
}