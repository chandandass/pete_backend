import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { AuthRequestDto } from '../shared/dto/shared.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: NestJwtService) {}

  // Method to generate JWT token
  generateToken(payload: AuthRequestDto) {
    return this.jwtService.sign(payload);
  }

  // Method to validate JWT token
  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return null;
    }
  }
}
