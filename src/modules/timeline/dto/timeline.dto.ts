import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsDateString,
  ValidateNested,
  IsObject,
  IsNumber,
} from 'class-validator';

export class MediaDto {
  @IsString()
  id: string;

  @IsString()
  imageUrl: string;
}

export class timelineDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsDateString()
  date: string;

  @IsString()
  description: string;

  @IsArray()
  media: MediaDto[];
}
export class PaginationInfoDto {
  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;

  @IsNumber()
  totalItems: number;

  @IsNumber()
  totalPages: number;
}

export class timelineResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => timelineDto)
  data: timelineDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => PaginationInfoDto)
  pagination: PaginationInfoDto;
}
