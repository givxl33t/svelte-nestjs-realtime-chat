import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { Notification } from './notification.model';
import { NotificationService } from './notifications.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Query(() => [Notification])
  @UseGuards(JwtAuthGuard)
  async myNotifications(
    @Context() context,
    @Args('limit', { type: () => Number, nullable: true }) limit: number = 10
  ): Promise<Notification[]> {
    const receiverId = context.req.user.id;
    return this.notificationService.findAll(receiverId, limit);
  }
  
  @Mutation(() => Boolean)
  async readNotifications(
    @Args('ids', { type: () => [String] }) ids: string[]
  ): Promise<boolean> {
    setTimeout(async () => await this.notificationService.readMany(ids), 300000);
    return true;
  }
}