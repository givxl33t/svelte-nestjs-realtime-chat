import { Resolver, Query, Mutation, Args, ID, Context, Subscription } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './users.service';
import { UserInput, LoginInput } from './user.input';
import { PasswordService } from "src/utils/password.util";
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService, 
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService
  ) {}

  @Subscription(() => User)
  userStatusUpdated() {
    return pubSub.asyncIterator(`userStatusUpdated`);
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
    user.access_token = access_token;

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
    }).then(() => {
      pubSub.publish(`userStatusUpdated`, { userStatusUpdated: { id: user.id, is_online: true } });
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
    }).then(() => {
      pubSub.publish(`userStatusUpdated`, { userStatusUpdated: { id: userId, is_online: false } });
    })
    return true;
  }
}