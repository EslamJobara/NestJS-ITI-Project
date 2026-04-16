import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });

      // Enhanced validation check for required claims
      if (!payload.sub || !payload.email || !payload.role) {
        throw new UnauthorizedException('Token payload is missing required user details.');
      }

      if (payload.tokenType !== 'access') {
        throw new UnauthorizedException('Invalid token type specified in JWT.');
      }

      request.user = payload;
      return true;
    } catch (e) {
      // Catch specific JWT exceptions for better user messaging
      const message = e.name === 'TokenExpiredError'
          ? 'Access token expired. Please refresh your session.'
          : e.message || 'Invalid or expired token';
      throw new UnauthorizedException(message);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization) {
      return undefined;
    }

    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) {
      return undefined;
    }

    return token;
  }
}
