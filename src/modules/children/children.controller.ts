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
  ChildDeletionResponse,
  IdParamDto,
  KidDto,
} from './dto/children.dto';
import { BaseKidDto } from '../shared/dto/shared.dto';

@Controller('children')
export class ChildrenController {
  @Get()
  async getChildren(@Request() req: any): Promise<KidDto[]> {
    const userId = req.user.userId;
    console.log(userId);
    const children: KidDto[] = [
      {
        id: 1234,
        name: 'Emli',
        date_of_birth: '2015-06-25',
        gender: 'FEMALE',
      },
    ]; // Replace with actual DB call
    return children;
  }

  @Post()
  async addChild(
    @Body() createChildDto: BaseKidDto,
    @Request() req: any,
  ): Promise<AddUpdateChildResponse> {
    const userId = req.user.userId;
    console.log(userId);

    const newChild = {
      name: createChildDto.name,
      date_of_birth: createChildDto.date_of_birth,
      gender: createChildDto.gender,
    };

    // Mock successful response
    return {
      message: 'Child added successfully.',
      child: newChild,
    };
  }

  @Put()
  async updateChild(
    @Body() updateChildDto: KidDto,
    @Request() req: any,
  ): Promise<AddUpdateChildResponse> {
    const userId = req.user.userId; // Retrieve user ID from JWT
    console.log(userId);

    // Simulate updating child in the database (replace with actual DB logic)
    const updatedChild = {
      name: updateChildDto.name,
      date_of_birth: updateChildDto.date_of_birth,
      gender: updateChildDto.gender,
    };

    // Mock successful response for updating child
    const response: AddUpdateChildResponse = {
      message: 'Child updated successfully.',
      child: updatedChild,
    };

    return response;
  }

  @Delete(':id')
  async deleteChild(
    @Param() params: IdParamDto,
    @Request() req: any,
  ): Promise<ChildDeletionResponse> {
    const userId = req.user.userId;
    console.log(userId);
    console.log(params);

    const response: ChildDeletionResponse = {
      message: 'Child successfully deleted.',
    };

    return response;
  }
}
