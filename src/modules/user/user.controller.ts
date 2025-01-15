import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { 
  SignUpDto, 
  LoginDto, 
  UpdateDetailsDto, 
  UpdatePasswordDto, 
  AuthResponse, 
  UpdateUserResponse, 
  ActionResponse 
} from './dto/user.dto';

@Controller('user')
export class UserController {

    @Get("current")
    async getCurrentUser() {
        // Add logic to get current user
    }

    @Post('sign-up')
    async singUp(@Body() userData: SignUpDto): Promise<AuthResponse> {
        console.log(userData.name.toLocaleLowerCase());
        console.log("userData", userData);
        return new AuthResponse("error", '1234');
    }

    @Post('login')
    async login(@Body() userData: LoginDto): Promise<AuthResponse> {
        console.log(userData.email.toLocaleLowerCase());
        console.log("userData", userData);
        return new AuthResponse("error", '1234');
    }

    @Put('details')
    async updateDetails(@Body() userData: UpdateDetailsDto): Promise<UpdateUserResponse> {
        console.log(userData)
        return new UpdateUserResponse("", {name: '', email: '', relation: ''});
    }

    @Put('password')
    async updatePassword(@Body() passwords: UpdatePasswordDto): Promise<ActionResponse> {
        return new ActionResponse("")
    }

    @Delete('delete')
    async delete(): Promise<ActionResponse> {
        return new ActionResponse("")
    }
}
