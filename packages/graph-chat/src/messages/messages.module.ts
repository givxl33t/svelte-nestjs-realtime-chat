import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './messages.service';
import { MessageResolver } from './messages.resolver';
import { Message, MessageSchema } from './message.model';
import { Room, RoomSchema } from '../rooms/room.model';
import { User, UserSchema } from "src/users/user.model";
import { RoomService } from '../rooms/rooms.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [
    MessageService, 
    MessageResolver, 
    RoomService,
    UsersModule
  ],
  imports: [MongooseModule.forFeature([
    { name: Message.name, schema: MessageSchema },
    { name: Room.name, schema: RoomSchema },
    { name: User.name, schema: UserSchema }
  ])]
})

export class MessagesModule {}