import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { BaseChildren } from 'src/modules/shared/dto/shared.dto';

export class Children extends BaseChildren {
  @IsNumber()
  id: number;
}

export class AddUpdateChildResponse {
  constructor(
    public message: string,
    public child: BaseChildren,
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
