import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { StaticFamilyPrompt } from 'src/entities/static/static-family-prompt.entity';
import { StaticReflectionPrompt } from 'src/entities/static/static-reflection-prompt.entity';
import { TrackReflectionPrompt } from 'src/entities/track_reflection_prompt.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { PromptGenerator } from './generator.service';
import { StaticKidPrompt } from 'src/entities/static/static-kid-mvp-prompt.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptHandler {
  private static readonly EXPIRATION_DAYS = 21;

  constructor(
    @InjectRepository(TrackReflectionPrompt)
    private readonly trp_repository: Repository<TrackReflectionPrompt>,
    @InjectRepository(StaticReflectionPrompt)
    private readonly srp_repository: Repository<StaticReflectionPrompt>,
    @InjectRepository(StaticFamilyPrompt)
    private readonly sfp_repository: Repository<StaticFamilyPrompt>,
    @InjectRepository(StaticKidPrompt)
    private readonly skp_repository: Repository<StaticKidPrompt>,
  ) {}

  // Generalized method for fetching static prompts
  private async getPrompts<T extends { id: number }>(
    repository: Repository<T>,
    user: User,
    generatorMethod: (user: User, prompts: T[]) => Post[],
  ): Promise<Post[]> {
    const prompts = await repository.find();
    return generatorMethod(user, prompts);
  }

  private async getFamilyPrompts(user: User): Promise<Post[]> {
    return this.getPrompts(
      this.sfp_repository,
      user,
      PromptGenerator.generateFamilyPrompts,
    );
  }

  private async getNextReflectionPrompt(
    currentPromptId: number,
  ): Promise<StaticReflectionPrompt> {
    try {
      // Query to fetch the next prompt after the current one
      const nextPrompt = await this.srp_repository
        .createQueryBuilder('srp')
        .where('srp.id > :currentPromptId', { currentPromptId })
        .orderBy('srp.id', 'ASC')
        .getOne();

      if (!nextPrompt) {
        // If no next prompt exists (we are at the last prompt), fetch the first one
        const firstPrompt = await this.srp_repository
          .createQueryBuilder('srp')
          .orderBy('srp.id', 'ASC') // Fetch the first prompt
          .getOne();

        if (!firstPrompt) {
          throw new Error('No reflection prompts available');
        }

        return firstPrompt;
      }

      return nextPrompt;
    } catch (error: any) {
      throw new Error(`Error fetching next prompt: ${error.message}`);
    }
  }

  private async createPostFromPrompt(
    user: User,
    prompt: StaticReflectionPrompt,
    createdAt: Date,
  ): Promise<Post> {
    const post = new Post();
    post.user = user;
    post.input_type = 'TEXT';
    post.prompt_type = 'REFLECTION';
    post.status = 'UNANSWERED';
    post.title = prompt.txt;
    post.show_order_date = createdAt;
    post.last_update = createdAt;
    post.created_at = createdAt;
    return post;
  }

  public async getChildrenPrompts(user: User): Promise<Post[]> {
    return this.getPrompts(
      this.skp_repository,
      user,
      PromptGenerator.generateKidPrompts,
    );
  }

  public async getReflectionPrompt(user: User): Promise<Post> {
    const currentDate = new Date();
    let expiredPrompt: TrackReflectionPrompt | null;

    try {
      expiredPrompt = await this.trp_repository.findOne({
        where: { user, status: 'ACTIVE' },
      });

      if (expiredPrompt) {
        const promptDate = new Date(expiredPrompt.created_at);
        const isExpired =
          currentDate.getTime() - promptDate.getTime() >
          PromptHandler.EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

        if (isExpired) {
          const nextPrompt = await this.getNextReflectionPrompt(
            expiredPrompt.prompt_id,
          );
          const newTrackPrompt = new TrackReflectionPrompt();
          newTrackPrompt.prompt_id = nextPrompt.id;
          newTrackPrompt.status = 'ACTIVE';
          newTrackPrompt.user = user;
          newTrackPrompt.created_at = currentDate;

          await this.trp_repository.update(
            { status: 'ACTIVE' },
            newTrackPrompt,
          );

          return this.createPostFromPrompt(user, nextPrompt, currentDate);
        }

        const prompt = await this.srp_repository.findOne({
          where: { id: expiredPrompt.prompt_id },
        });
        if (!prompt) throw new Error('Prompt does not exist');

        return this.createPostFromPrompt(user, prompt, promptDate);
      }

      const prompt = await this.srp_repository
        .createQueryBuilder('srp')
        .leftJoin('track_reflection_prompt', 'trp', 'trp.prompt_id = srp.id')
        .where('trp.status != :status OR trp.status IS NULL', {
          status: 'ARCHIVED',
        })
        .orderBy('srp.id', 'ASC')
        .select(['srp.id', 'srp.txt'])
        .getOne();

      if (!prompt) throw new Error('No prompts available');

      const track_reflection_prompt = new TrackReflectionPrompt();
      track_reflection_prompt.prompt_id = prompt.id;
      track_reflection_prompt.status = 'ACTIVE';
      track_reflection_prompt.user = user;
      track_reflection_prompt.created_at = currentDate;

      await this.trp_repository.save(track_reflection_prompt);

      return this.createPostFromPrompt(user, prompt, currentDate);
    } catch (error: any) {
      throw new Error(`Error processing reflection prompt: ${error.message}`);
    }
  }

  public async getAgePrompts(user: User, years: number = 19): Promise<Post[]> {
    try {
      return PromptGenerator.generateAgePrompts(user, years);
    } catch (error: any) {
      // Handle or log the error as needed
      console.error(
        `Error generating age prompts for user ${user.id}:`,
        error.message,
      );
      throw new Error(`Failed to generate age prompts: ${error.message}`);
    }
  }

  public async getAllPrompts(user: User): Promise<Post[]> {
    try {
      const familyPrompts = await this.getFamilyPrompts(user);
      const childrenPrompts = await this.getChildrenPrompts(user);
      return [...familyPrompts, ...childrenPrompts];
    } catch (error: any) {
      throw new Error(`Error fetching all prompts: ${error.message}`);
    }
  }
}
