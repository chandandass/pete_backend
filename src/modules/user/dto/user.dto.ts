import { Exclude } from 'class-transformer';
import { IsString, IsArray, IsIn, IsEmail } from 'class-validator';
import { Children } from 'src/modules/children/dto/children.dto';
import { BaseChildren, UserDto } from 'src/modules/shared/dto/shared.dto';

// ReminderSchedules DTO with class-validator
export class ReminderSchedulesDto {
  @IsString()
  update: string;

  @IsString()
  unanswered: string;

  @IsString()
  random: string;
}

// SignUp DTO (used for user registration)
export class SignUpDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsIn(['MOM', 'DAD']) // Ensures the value is either 'MOM' or 'DAD'
  relation: 'MOM' | 'DAD';

  @IsString()
  password: string;

  @IsArray()
  children: BaseChildren[]; // Array of kids, validated as an array of Children objects
}

// Login DTO
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

// Update Details DTO (used for updating user details)
export class UpdateDetailsDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsIn(['MOM', 'DAD'])
  relation: string;
}

// Update Password DTO
export class UpdatePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}

// CurrentUserResponse DTO extending UserDto but excluding `id`
export class CurrentUserResponse extends UserDto {
  @Exclude()
  id: number;

  children: Children[];
  ReminderSchedules: ReminderSchedulesDto;
}

// Auth Response DTO
export class AuthResponse {
  constructor(
    public message: string,
    public token: string,
  ) {}
}

// Update User Response DTO
export class UpdateUserResponse {
  constructor(
    public message: string,
    public user: {
      name: string;
      email: string;
      relation: string;
    },
  ) {}
}
