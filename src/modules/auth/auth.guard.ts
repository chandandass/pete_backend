import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard {
  constructor(private readonly jwtService: AuthService) {}

  // This method checks if the request has a valid JWT token and adds user data
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = await this.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = user;
    return true;
  }

  // Extract token from the authorization header
  private extractTokenFromRequest(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return null;
    }
    return authHeader.split(' ')[1];
  }

  // Validate the token and decode it
  private async validateToken(token: string) {
    return this.jwtService.validateToken(token);
  }
}
