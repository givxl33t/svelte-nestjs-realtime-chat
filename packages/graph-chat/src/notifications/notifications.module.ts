import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notifications.service';
import { NotificationResolver } from './notifications.resolver';
import { Notification, NotificationSchema } from './notification.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [NotificationService, NotificationResolver, UsersModule],
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])]
})

export class NotificationsModule {}