import { Module } from "@nestjs/common";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { RoomService } from "./rooms.service";
import { RoomResolver } from "./rooms.resolver";
import { Room, RoomSchema } from "./room.model";
import { UsersModule } from "src/users/users.module";
import { User, UserSchema } from "src/users/user.model";
import { Message, MessageSchema } from "src/messages/message.model";

@Module({
  providers: [
    RoomService, 
    RoomResolver,
    UsersModule
  ],
  imports: [MongooseModule.forFeatureAsync([
      { 
        name: Room.name,
        inject: [getModelToken(Message.name)],
        imports: [
          MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])
        ],
        useFactory: () => {
          const schema = RoomSchema;
          return schema;
        }
      },
      { 
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          return schema;
        }
      }
    ])
  ]
})

export class RoomsModule {}