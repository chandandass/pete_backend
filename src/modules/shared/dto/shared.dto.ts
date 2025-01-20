import { IsDateString, IsIn, IsNumber, IsString } from 'class-validator';

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

export class BaseChildren {
  @IsString()
  name: string;

  @IsDateString()
  date_of_birth: Date;

  @IsIn(['MALE', 'FEMALE'])
  gender: 'MALE' | 'FEMALE';
}
// Action Response DTO
export class ActionResponse {
  constructor(public message: string) {}
}
