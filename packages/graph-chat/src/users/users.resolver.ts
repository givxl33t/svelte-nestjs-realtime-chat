import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './users.service';
import { UserInput, LoginInput } from './user.input';
import { PasswordService } from "src/utils/password.util";
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService, 
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService
  ) {}

  @Query(() => [User])
  @UseGuards(JwtAuthGuard)
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User)
  async user(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.findOne(id);
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
  async login(@Args('input') input: LoginInput): Promise<User> {
    const user = await this.userService.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const validPassword = await this.passwordService.compare(user.password, input.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    user.access_token = access_token;
    
    return user
  }
}