import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import {
  SignUpDto,
  LoginDto,
  UpdateDetailsDto,
  UpdatePasswordDto,
  AuthResponse,
  UpdateUserResponse,
  CurrentUserResponse,
} from './dto/user.dto';
import { ActionResponse, UserDto } from '../shared/dto/shared.dto';

@Controller('user')
export class UserController {
  @Get('current')
  async getCurrentUser(): Promise<CurrentUserResponse> {
    const dummyResponse: CurrentUserResponse = {
      name: 'Neel Patel',
      relation: 'MOM',
      email: 'neelpatel.6531@gmail.com',
      kids: [
        {
          name: 'Emli',
          dateOfBirth: '2015-06-25',
          gender: 'FEMALE',
        },
      ],
      reminderSchedules: {
        update: '7:00',
        unanswered: '18:00',
        random: '8:00',
      },
      id: -1,
    };
    return dummyResponse;
  }

  @Post('sign-up')
  async singUp(@Body() userData: SignUpDto): Promise<AuthResponse> {
    console.log(userData.name.toLocaleLowerCase());
    console.log('userData', userData);
    return new AuthResponse('sing-up', '1234');
  }

  @Post('login')
  async login(@Body() userData: LoginDto): Promise<AuthResponse> {
    console.log(userData.email.toLocaleLowerCase());
    console.log('userData', userData);
    console.log('typeofpass', typeof userData.password);
    return new AuthResponse('login', '1234');
  }

  @Put('details')
  async updateDetails(
    @Body() userData: UpdateDetailsDto,
  ): Promise<UpdateUserResponse> {
    console.log(userData);
    return new UpdateUserResponse('details', {
      name: '',
      email: '',
      relation: '',
    });
  }

  @Put('password')
  async updatePassword(
    @Body() passwords: UpdatePasswordDto,
  ): Promise<ActionResponse> {
    console.log(passwords);
    return new ActionResponse('updatePassword');
  }

  @Delete('delete')
  async delete(@Body() userData: UserDto): Promise<ActionResponse> {
    console.log(userData);
    return new ActionResponse('deleteUser');
  }
}
