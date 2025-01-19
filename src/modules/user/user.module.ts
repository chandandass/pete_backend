import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Child } from 'src/entities/child.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptModule } from '../prompt/prompt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Child]), PromptModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
