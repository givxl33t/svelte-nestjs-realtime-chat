import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { UserService } from "src/users/users.service";
import { PubSubService } from "src/utils/pubSub.util";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService, 
    private readonly userService: UserService,
    private readonly pubSubService: PubSubService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.access_token;
          },
        ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.sub);
    if (!user || !payload) {
      throw new UnauthorizedException();
    }

    if (user.is_online === false) {
      await this.userService.update(payload.sub, { 
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
    }

    return user;
  }
}