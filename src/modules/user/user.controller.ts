import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  SignUpDto,
  LoginDto,
  UpdateDetailsDto,
  UpdatePasswordDto,
  AuthResponse,
  UpdateUserResponse,
  CurrentUserResponse,
} from './dto/user.dto';
import { ActionResponse, AuthRequestDto } from '../shared/dto/shared.dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('sign-up')
  async singUp(@Body() userData: SignUpDto): Promise<AuthResponse> {
    const user = await this.userService.signUp(userData);
    const token = await this.authService.generateToken({ id: user.id });
    return new AuthResponse('user created successfully', token);
  }

  @Post('login')
  async login(@Body() userData: LoginDto): Promise<AuthResponse> {
    const user = await this.userService.login(userData);
    const token = await this.authService.generateToken({ id: user.id });
    return new AuthResponse('user logged in successfully', token);
  }

  @Get('current')
  @UseGuards(AuthGuard)
  async getCurrentUser(
    @Request() authRequestDto: AuthRequestDto,
  ): Promise<CurrentUserResponse> {
    return this.userService.getCurrentUser(authRequestDto.id);
  }

  @Put('details')
  @UseGuards(AuthGuard)
  async updateDetails(
    @Request() authRequestDto: AuthRequestDto,
    @Body() userData: UpdateDetailsDto,
  ): Promise<UpdateUserResponse> {
    console.log(userData);
    return await this.userService.updateDetails(authRequestDto, userData);
  }

  @Put('password')
  @UseGuards(AuthGuard)
  async updatePassword(
    @Request() authRequestDto: AuthRequestDto,
    @Body() passwords: UpdatePasswordDto,
  ): Promise<ActionResponse> {
    console.log(passwords);
    return this.userService.updatePassword(authRequestDto, passwords);
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  async delete(
    @Request() authRequestDto: AuthRequestDto,
  ): Promise<ActionResponse> {
    console.log(authRequestDto);
    return await this.userService.delete(authRequestDto);
  }
}
