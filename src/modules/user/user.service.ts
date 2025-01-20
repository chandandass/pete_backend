import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CurrentUserResponse,
  LoginDto,
  SignUpDto,
  UpdateDetailsDto,
  UpdatePasswordDto,
  UpdateUserResponse,
} from './dto/user.dto';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Child } from 'src/entities/child.entity';
import { PromptHandler } from '../prompt/handler.service';
import { Post } from 'src/entities/post.entity';
import { ActionResponse, AuthRequestDto } from '../shared/dto/shared.dto';
import { PasswordService } from './password.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
    private readonly connection: Connection,
    private readonly promptHandler: PromptHandler,
    private readonly passwordService: PasswordService,
  ) {}

  async signUp(signUpData: SignUpDto): Promise<User> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const hashedPassword = await this.passwordService.hashPassword(
        signUpData.password,
      );
      const user = this.userRepository.create({
        name: signUpData.name,
        email: signUpData.email,
        password: hashedPassword,
        relation: signUpData.relation,
      });

      await queryRunner.manager.save(user);

      const children = signUpData.children.map((child) =>
        this.childRepository.create({
          name: child.name,
          date_of_birth: child.date_of_birth,
          gender: child.gender,
          parent_user: user,
        }),
      );

      await queryRunner.manager.save(children);
      user.children = children;

      const posts = await this.promptHandler.getAllPrompts(user);
      await queryRunner.manager.save(Post, posts);

      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Error during signup process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginData: LoginDto): Promise<User> {
    console.log('Logging in user:', loginData.email.toLocaleLowerCase());

    const user = await this.userRepository.findOne({
      where: { email: loginData.email.toLocaleLowerCase() },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async getCurrentUser(userId: number): Promise<CurrentUserResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['children', 'ReminderSchedules'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateDetails(
    authRequestDto: AuthRequestDto,
    updateDetails: UpdateDetailsDto,
  ): Promise<UpdateUserResponse> {
    const user = await this.userRepository.findOne({
      where: { id: authRequestDto.id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (updateDetails.email && updateDetails.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateDetails.email },
      });

      if (existingUser) {
        throw new HttpException(
          'Email is already in use by another user',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    Object.assign(user, {
      name: updateDetails.name || user.name,
      relation: updateDetails.relation || user.relation,
      email: updateDetails.email || user.email,
    });

    const updatedUser = await this.userRepository.save(user);

    return new UpdateUserResponse(
      'User details updated successfully',
      updatedUser,
    );
  }

  async updatePassword(
    authRequestDto: AuthRequestDto,
    passwords: UpdatePasswordDto,
  ): Promise<ActionResponse> {
    const user = await this.userRepository.findOne({
      where: { id: authRequestDto.id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      passwords.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Current password is not correct',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.passwordService.hashPassword(
      passwords.newPassword,
    );
    await this.userRepository.update(
      { id: user.id },
      { password: hashedPassword },
    );

    return new ActionResponse('Password updated successfully');
  }

  async delete(authRequestDto: AuthRequestDto): Promise<ActionResponse> {
    const user = await this.userRepository.findOne({
      where: { id: authRequestDto.id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.remove(user);
    return new ActionResponse('User deleted successfully');
  } 
}
