import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PractitionersService } from 'src/practitioners/practitioners.service';

@Injectable()
export class PractitionerGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private practitionersService: PractitionersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Not authorized, no token!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const practitioner =
        await this.practitionersService.findByEmailWithoutPassword(
          payload.email,
        );

      request['practitioner'] = { ...practitioner };
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
