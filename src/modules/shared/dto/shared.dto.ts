import { IsDateString, IsNumber, IsString } from "class-validator";

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
  
export class BaseKidDto {
  @IsString()
  name: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  gender: string;
}