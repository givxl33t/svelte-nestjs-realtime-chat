import { Resolver, Query, Mutation, Args, ID, Context, Subscription } from '@nestjs/graphql';
import { User, UserStatusSubscription } from './user.model';
import { UserService } from './users.service';
import { UserInput, LoginInput } from './user.input';
import { PasswordService } from "src/utils/password.util";
import { PubSubService } from 'src/utils/pubSub.util';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService, 
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly pubSubService: PubSubService
  ) {}

  @Subscription(() => UserStatusSubscription)
  userStatusUpdated() {
    return this.pubSubService.getChannel(`userStatusUpdated`);
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard)
  async users(@Context() context): Promise<User[]> {
    const userId = context.req.user.id;
    let users = await this.userService.findAll();
    return users.filter(user => user.id !== userId);
  }

  @Query(() => User)
  async user(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@Context() context): Promise<User> {
    const userId = context.req.user.id;
    return this.userService.findOne(userId);
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: UserInput): Promise<User> {
    const existingEmail = await this.userService.findByEmail(input.email);
    if (existingEmail) {
      throw new Error('Email already in use');
    }

    return this.userService.create(input);
  }

  @Mutation(() => User)
  async login(
      @Context() context,
      @Args('input') input: LoginInput
    ): Promise<User> {
    const user = await this.userService.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const validPassword = await this.passwordService.compare(user.password, input.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    const payload = { email: user.email, name: user.name, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    context.res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      signed: false,
    });


    await this.userService.update(user.id, { 
      email: user.email,
      name: user.name,
      password: user.password,
      is_online: true,
    }).then((updatedUser) => {
      this.pubSubService.publish(`userStatusUpdated`, { userStatusUpdated: { id: updatedUser.id, is_online: updatedUser.is_online } });
      setTimeout(async () => {
        await this.userService.update(updatedUser.id, { 
          email: updatedUser.email,
          name: updatedUser.name,
          password: updatedUser.password,
          is_online: false,
        }).then((offlineUser) => {
          this.pubSubService.publish(`userStatusUpdated`, { userStatusUpdated: { id: offlineUser.id, is_online: offlineUser.is_online } });
        })
      }, 30000);
    })
    
    return user
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@Context() context): Promise<boolean> {
    context.res.clearCookie('access_token');
    const userId = context.req.user.id;

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userService.update(userId, { 
      email: user.email,
      name: user.name,
      password: user.password,
      is_online: false,
    }).then((updatedUser) => {
      this.pubSubService.pubSub.publish(`userStatusUpdated`, { userStatusUpdated: { id: updatedUser.id, is_online: updatedUser.is_online } });
    })
    return true;
  }
}