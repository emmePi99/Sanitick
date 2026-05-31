import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserCoreService } from '../../../core/user/service/user/user-core.service';
import { AccessTokenUser } from '../model/access-token-user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userCoreService: UserCoreService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret',
    });
  }

  async validate(payload: AccessTokenUser) {
    const user = await this.userCoreService.findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { ...user, ...payload };
  }
}
