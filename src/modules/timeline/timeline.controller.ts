import { Controller, Get, Query, Request} from '@nestjs/common';
import { TimelineResponseDto } from './dto/timeline.dto';

@Controller('timeline')
export class TimelineController {
    @Get()
    async getTimeline(
      @Request() req: any,       // Retrieve user from JWT (typically injected by JwtAuthGuard)
      @Query('page') page: number = 1, // Default to page 1 if not provided
      @Query('limit') limit: number = 10, // Default to limit of 10 if not provided
    ): Promise<TimelineResponseDto> {
      const userId = req.user.userId; // Get userId from the JWT
  
      const items = [
        {
          id: '2342',
          title: 'TITLE',
          date: '2025-01-13T12:00:00Z',
          description: 'LONG TEXT',
          media: [
            { id: '2345', imageUrl: 's3-url-1' },
          ],
        },
      ];
  
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / limit);
      const paginatedItems = items.slice((page - 1) * limit, page * limit);
  
      return {
        data: paginatedItems,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
        },
      };
    }
}
