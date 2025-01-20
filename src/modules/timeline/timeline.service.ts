import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import { ActionResponse } from '../shared/dto/shared.dto';
import { TrackReflectionPrompt } from 'src/entities/track_reflection_prompt.entity';
import {
  DeleteTimelineDto,
  PaginationInfoResponse,
  TimestampDto,
} from './dto/timeline.dto';
import { PAGINATION_INFO_QUERY } from './timeline.query';

@Injectable()
export class TimelineService {
  private readonly DEFAULT_PAGE_SIZE = 11;
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(TrackReflectionPrompt)
    private readonly trpRepository: Repository<TrackReflectionPrompt>,
  ) {}

  async getTimelinePaginationInfo(
    userId: number,
    query: TimestampDto,
  ): Promise<PaginationInfoResponse> {
    try {
      // For now, you are returning a static response like in your example
      console.log('Fetching pagination info with query:', query);

      // Execute the raw query
      const result = await this.postRepository.query(PAGINATION_INFO_QUERY, [
        userId,
        query.timestamp.toISOString(),
      ]);

      // If no posts are found for the user, throw an HTTP exception
      if (result.length === 0) {
        throw new HttpException(
          'No posts exist for the given user',
          HttpStatus.NOT_FOUND,
        );
      }

      const { row_num, total_posts } = result[0];

      // Calculate the percentage
      const percentage = (row_num / total_posts) * 100;
      return new PaginationInfoResponse(percentage, this.DEFAULT_PAGE_SIZE);
    } catch (error) {
      // Handle unexpected errors gracefully
      console.error('Error fetching timeline pagination info:', error);

      // Re-throw known HTTP exceptions to the caller
      if (error instanceof HttpException) {
        throw error;
      }

      // For other errors, return a generic internal server error
      throw new HttpException(
        'An error occurred while fetching pagination info',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTimelineEntry(
    postId: number,
    userId: number,
    deleteTimelineDto: DeleteTimelineDto,
  ): Promise<ActionResponse> {
    if (deleteTimelineDto.prompt_type === 'REFLECTION') {
      const result = await this.trpRepository.update(
        { prompt_id: postId, user: { id: userId } },
        { status: 'ARCHIVED' },
      );
      if (result.affected === 0) {
        throw new Error('Post not found');
      }
      return new ActionResponse('prompt deleted succesfully');
    }

    const post = await this.postRepository.findOne({
      where: {
        id: postId,
        user: { id: userId },
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Delete the post
    await this.postRepository.remove(post);

    return new ActionResponse('Timeline entry deleted successfully');
  }
}
