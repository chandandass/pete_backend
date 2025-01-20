import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import {
  DeleteTimelineDto,
  EditTimelineDto,
  GetTimelineResponse,
  PaginationInfoResponse,
  TimelineDto,
  TimestampDto,
} from './dto/timeline.dto';
import { ActionResponse, AuthRequestDto } from '../shared/dto/shared.dto';
import { TimelineService } from './timeline.service';

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}
  @Get('pagination-info')
  async getTimelineInfo(
    @Request() req: any,
    @Query() query: TimestampDto,
  ): Promise<PaginationInfoResponse> {
    console.log(req, query);
    return new PaginationInfoResponse(0.5, 20);
  }

  @Get()
  async getTimeline(
    @Request() req: any,
    @Query() query: TimelineDto, // Using the DTO for query parameters
  ): Promise<GetTimelineResponse> {
    console.log(req, query);
    // Logic to call the service to get the timeline prompts
    return new GetTimelineResponse([
      {
        id: 1,
        title: 'What did you do to prepare for my arrival?',
        description: 'A family gathering at the park.',
        prompt_type: 'FAMILY',
        input_type: 'IMAGE',
        status: 'ANSWERED',
        created_at: '2025-01-10T10:00:00Z',
        last_update: '2025-01-10T10:15:00Z',
        show_order_date: '2025-01-10T10:00:00Z',
        child_id: 101,
        user_id: 202,
        media: [
          {
            id: 12,
            url: 'http://',
          },
        ],
      },
    ]);
  }

  @Put(':id')
  async editTimelineEntry(
    @Request() req: any,
    @Param('id') id: string,
    @Body() editTimeline: EditTimelineDto,
  ): Promise<ActionResponse> {
    console.log(req, id, editTimeline);
    // Logic to edit the timeline entry
    return new ActionResponse('Timeline entry updated');
  }

  @Delete(':id')
  async deleteTimelineEntry(
    @Request() authRequestDto: AuthRequestDto,
    @Param('id') id: number, //
    @Query() deleteTimelineDto: DeleteTimelineDto,
  ): Promise<ActionResponse> {
    return this.timelineService.deleteTimelineEntry(
      id,
      authRequestDto.id,
      deleteTimelineDto,
    );
  }
}
