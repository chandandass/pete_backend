import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class TimestampDto {
  @IsString()
  timestamp?: string;
}

export class TimelineDto {
  @ValidateIf((o) => !o.timestamp && !o.direction) // When neither timestamp nor direction is provided, cursor becomes optional
  @IsOptional()
  @IsNumber()
  cursor?: number;

  @ValidateIf((o) => o.cursor === undefined) // If cursor is not provided, timestamp is required
  @IsString()
  timestamp?: string;

  @ValidateIf((o) => o.cursor === undefined)
  @IsEnum(['UP', 'DOWN'])
  @IsNotEmpty()
  direction: string;

  @IsNumber()
  @IsNotEmpty()
  page_size: number;
}

class MediaDto {
  id: number;
  url: string;
}

export class PromptDto {
  id: number;
  title: string;
  description: string;
  prompt_type: string;
  input_type: string;
  status: string;
  created_at: string;
  last_update: string;
  show_order_date: string;
  child_id: number;
  user_id: number;
  media: MediaDto[];
}

class EditMedia {
  @IsNumber()
  id: number;

  @IsEnum(['ADD', 'DELETE'])
  action: 'ADD' | 'DELETE';
}

export class EditTimelineDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  show_order_date?: string;

  @IsArray()
  @IsOptional()
  media?: EditMedia[];
}

export class GetTimelineResponse {
  prompts: PromptDto[];

  constructor(prompts: PromptDto[]) {
    this.prompts = prompts;
  }
}
// PaginationInfoDto (Success Response)
export class PaginationInfoResponse {
  constructor(
    public cursor: number,
    public page_size: number,
  ) {}
}
