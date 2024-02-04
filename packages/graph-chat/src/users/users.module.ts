import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserService } from "./users.service";
import { UserResolver } from "./users.resolver";
import { User, UserSchema } from "./user.model";
import { PasswordService } from "src/utils/password.util";
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from "src/guards/passportStrategy.guard";

@Module({
  providers: [
    UserService,
    PasswordService,
    UserResolver,
    JwtStrategy,
  ],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          const passwordService = new PasswordService();
          schema.pre('save', async function() {
            if (this.isModified('password')) {
              const hashed = await passwordService.toHash(this.get('password'));
              this.set('password', hashed);
            }
          });
          return schema;
        }
      }
    ]),
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
})

export class UsersModule {}