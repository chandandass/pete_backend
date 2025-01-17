import { Exclude } from 'class-transformer';
import { IsString, IsArray, IsIn } from 'class-validator';
import { BaseKidDto, UserDto } from 'src/modules/shared/dto/shared.dto';

// reminder_schedules DTO with class-validator
export class reminder_schedulesDto {
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
  kids: BaseKidDto[]; // Array of kids, validated as an array of KidDto objects
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

  kids: BaseKidDto[];
  reminder_schedules: reminder_schedulesDto;
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
