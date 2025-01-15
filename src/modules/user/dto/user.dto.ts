import { Exclude } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsDateString,
  IsNumber,
  IsIn,
} from 'class-validator';

// Shared DTO for Kid
export class KidDto {
  @IsString()
  name: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  gender: string;
}

// Base User DTO
export class UserDto {
  @IsNumber()
  id: number; // id will be required in UserDto

  @IsString()
  name: string;

  @IsString()
  relation: string;

  @IsString()
  email: string;
}

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

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  kids: KidDto[]; // Array of kids, validated as an array of KidDto objects
}

// Login DTO
export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

// Update Details DTO (used for updating user details)
export class UpdateDetailsDto {
  @IsString()
  name: string;

  @IsIn(['MOM', 'DAD']) // Ensures the value is either 'MOM' or 'DAD'
  relation: 'MOM' | 'DAD';

  @IsString()
  email: string;
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
  @Exclude() // Exclude the `id` field in the CurrentUserResponse response
  id: number;

  kids: KidDto[];
  reminderSchedules: ReminderSchedulesDto;
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

// Action Response DTO
export class ActionResponse {
  constructor(public message: string) {}
}
