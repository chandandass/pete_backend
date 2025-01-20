import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticFamilyPrompt } from 'src/entities/static/static-family-prompt.entity';
import { StaticKidPrompt } from 'src/entities/static/static-kid-mvp-prompt.entity';
import { StaticReflectionPrompt } from 'src/entities/static/static-reflection-prompt.entity';
import { TrackReflectionPrompt } from 'src/entities/track_reflection_prompt.entity';
import { PromptHandler } from './handler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrackReflectionPrompt,
      StaticReflectionPrompt,
      StaticFamilyPrompt,
      StaticKidPrompt,
    ]),
  ],
  controllers: [],
  providers: [PromptHandler],
  exports: [PromptHandler],
})
export class PromptModule {}
