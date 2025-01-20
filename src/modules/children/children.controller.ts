import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common'; // Import Get and Request decorators
import {
  AddUpdateChildResponse,
  IdParamDto,
  Children,
} from './dto/children.dto';
import {
  ActionResponse,
  AuthRequestDto,
  BaseChildren,
} from '../shared/dto/shared.dto';
import { ChildrenService } from './children.service';

@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}
  @Get()
  async getChildren(
    @Request() authRequestDto: AuthRequestDto,
  ): Promise<Children[]> {
    return this.childrenService.getChildren(authRequestDto.id);
  }

  @Post()
  async addChild(
    @Request() authRequestDto: AuthRequestDto,
    @Body() createChildDto: BaseChildren,
  ): Promise<AddUpdateChildResponse> {
    return this.childrenService.addChild(authRequestDto.id, createChildDto);
  }

  @Put()
  async updateChild(
    @Request() authRequestDto: AuthRequestDto,
    @Body() updateChildDto: Children,
  ): Promise<AddUpdateChildResponse> {
    return this.childrenService.updateChild(authRequestDto.id, updateChildDto);
  }

  @Delete(':id')
  async deleteChild(
    @Param() params: IdParamDto,
    @Request() authRequestDto: AuthRequestDto,
  ): Promise<ActionResponse> {
    return this.childrenService.deleteChild(authRequestDto.id, params.id);
  }
}
