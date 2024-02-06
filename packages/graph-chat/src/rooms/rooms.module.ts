import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomService } from "./rooms.service";
import { RoomResolver } from "./rooms.resolver";
import { Room, RoomSchema } from "./room.model";
import { UsersModule } from "src/users/users.module";
import { User, UserSchema } from "src/users/user.model";

@Module({
  providers: [
    RoomService, 
    RoomResolver,
    UsersModule
  ],
  imports: [MongooseModule.forFeature([
    { name: Room.name, schema: RoomSchema },
    { name: User.name, schema: UserSchema }
  ])]
})

export class RoomsModule {}