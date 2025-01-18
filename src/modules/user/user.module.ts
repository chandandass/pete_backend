import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Child } from 'src/entities/child.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Child])  // Make sure you are adding your repositories here
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
