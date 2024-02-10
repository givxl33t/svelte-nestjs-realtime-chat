import { Resolver, Query, Mutation, Args, ID, Context, Subscription } from '@nestjs/graphql';
import { Notification } from 'src/notifications/notification.model';
import { Message } from './message.model';
import { MessageService } from './messages.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { MessageInput } from './message.input';
import { PubSubService } from 'src/utils/pubSub.util';
import { NotificationService } from 'src/notifications/notifications.service';

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly messagesService: MessageService,
    private readonly notificationService: NotificationService,
    private readonly pubSubService: PubSubService
  ) {}

  @Subscription(() => Message)
  messageCreated() {
    return this.pubSubService.getChannel(`messageCreated`);
  }

  @Subscription(() => Notification)
  notificationCreated() {
    return this.pubSubService.getChannel(`notificationCreated`);
  }

  @Query(() => [Message])
  @UseGuards(JwtAuthGuard)
  async messages(): Promise<Message[]> {
    return this.messagesService.findAll();
  }

  @Query(() => Message)
  async message(@Args('id', { type: () => ID }) id: string): Promise<Message> {
    return this.messagesService.findOne(id);
  }

  @Mutation(() => Message)
  @UseGuards(JwtAuthGuard)
  async createMessage(
    @Context() context, 
    @Args('input') input: MessageInput): Promise<Message> {
      const messengerId = context.req.user.id;

      const message = await this.messagesService.create(input.room, messengerId, input.text)
        .then((message) => {
          this.pubSubService.publish('messageCreated', { messageCreated: message});
          return message;}
        );

      const receiverUser = message.room.users.filter((user) => user.toString() !== messengerId)[0];
      const senderUser = context.req.user;
      await this.notificationService.create({
        receiver: receiverUser,
        text: `New message from ${senderUser.name}`,
        metadata: [
          { key: 'message', value: message.id },
          { key: 'room', value: message.room.id }
        ]
      }).then((notification) => {
        this.pubSubService.publish(`notificationCreated`, { notificationCreated: notification });
      });

      return message;
  }
}
