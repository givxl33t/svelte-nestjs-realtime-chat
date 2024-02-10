import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './messages.service';
import { MessageResolver } from './messages.resolver';
import { Message, MessageSchema } from './message.model';
import { Notification, NotificationSchema } from 'src/notifications/notification.model';
import { Room, RoomSchema } from '../rooms/room.model';
import { User, UserSchema } from "src/users/user.model";
import { RoomService } from '../rooms/rooms.service';
import { NotificationService } from 'src/notifications/notifications.service';
import { UsersModule } from 'src/users/users.module';
import { PubSubService } from "src/utils/pubSub.util";

@Module({
  providers: [
    MessageService, 
    MessageResolver,
    RoomService,
    UsersModule,
    NotificationService,
    PubSubService,
  ],
  imports: [MongooseModule.forFeature([
    { name: Message.name, schema: MessageSchema },
    { name: Room.name, schema: RoomSchema },
    { name: User.name, schema: UserSchema },
    { name: Notification.name, schema: NotificationSchema }
  ])]
})

export class MessagesModule {}