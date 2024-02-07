import { Resolver, Query, Mutation, Args, ID, Context, Subscription } from '@nestjs/graphql';
import { Message } from './message.model';
import { MessageService } from './messages.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { MessageInput } from './message.input';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly messagesService: MessageService,
  ) {}

  @Subscription(() => Message)
  messageCreated() {
    return pubSub.asyncIterator(`messageCreated`);
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

      const createdMessage = await this.messagesService.create({ ...input, user: messengerId })
        .then((message) => {
          pubSub.publish('messageCreated', { messageCreated: message });
          return message;
        });

      return createdMessage;
  }
}
