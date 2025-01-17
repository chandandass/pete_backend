import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { BaseKidDto } from 'src/modules/shared/dto/shared.dto';

export class KidDto extends BaseKidDto {
  @IsNumber()
  id: number;
}

export class AddUpdateChildResponse {
  constructor(
    public message: string,
    public child: BaseKidDto,
  ) {}
}

export class ChildDeletionResponse {
  message: string;
}

export class IdParamDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
