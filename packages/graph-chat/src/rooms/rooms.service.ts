import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Room, RoomDocument } from "./room.model";
import { User, UserDocument } from "src/users/user.model";

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async findAll(): Promise<Room[]> {
    return this.roomModel.find()
      .populate('users')
      .populate({ path: 'messages', populate: { path: 'user' } })
      .exec();
  }

  async findOne(id: string): Promise<Room> {
    return this.roomModel.findById(id)
      .populate('users')
      .populate({ path: 'messages', populate: { path: 'user' } })
      .exec();
  }

  async findOneByUsers(userIds: string[]): Promise<Room> {
    return this.roomModel.findOne({ users: { $all: userIds } })
      .populate('users')
      .populate({ path: 'messages', populate: { path: 'user' } })
      .exec();
  }

  async create(userIds: string[]): Promise<Room> {
    const users = await this.userModel.find({ _id: { $in: userIds } });
    const newRoom = new this.roomModel({ users });
    return newRoom.save();
  }

  async delete(id: string): Promise<Room> {
    return this.roomModel.findByIdAndDelete(id).exec();
  }
}