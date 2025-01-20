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
import { ActionResponse, UserDto } from '../shared/dto/shared.dto';
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
      // Create the User entity
      const user = this.userRepository.create({
        name: signUpData.name,
        email: signUpData.email,
        password: hashedPassword,
        relation: signUpData.relation,
      });

      // Save the User entity first
      await queryRunner.manager.save(user);

      // Create Child entities and associate them with the User
      const children = signUpData.children.map((child) =>
        this.childRepository.create({
          name: child.name,
          date_of_birth: child.date_of_birth,
          gender: child.gender,
          parent_user: user,
        }),
      );

      // Save the Child entities
      await queryRunner.manager.save(children);
      user.children = children;

      // Generate and save dynamic prompts
      const posts = await this.promptHandler.getAllPrompts(user);

      await queryRunner.manager.save(Post, posts);
      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginData: LoginDto): Promise<User> {
    console.log('Logging in user:', loginData.email.toLocaleLowerCase());
    console.log('Received loginData data:', loginData);

    const user = await this.userRepository.findOne({
      where: { email: loginData.email.toLocaleLowerCase() },
    });
    const isPasswordValid = await this.passwordService.comparePassword(
      loginData.password,
      user?.password || '',
    );
    if (!user || !isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async getCurrentUser(userId: number): Promise<CurrentUserResponse> {
    // Fetch the user, including children and reminder schedules
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['children', 'ReminderSchedules'], // Fetch related entities
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Create the response DTO
    // const currentUserResponse: CurrentUserResponse = {
    //     ...user, // Spread the user data
    //     children: user.children,
    //     ReminderSchedules: user.ReminderSchedules as ReminderSchedule,
    //   };

    return user;
  }

  async updateDetails(
    userData: UserDto,
    updateDetails: UpdateDetailsDto,
  ): Promise<UpdateUserResponse> {
    console.log('Updating user details:', userData);

    // Find the user by the current email
    const user = await this.userRepository.findOne({
      where: { id: userData.id },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // If the email is changing, check for conflicts
    if (updateDetails.email && updateDetails.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateDetails.email },
      });
      if (existingUser) {
        throw new Error('Email is already in use by another user');
      }
    }

    // Update only the fields provided in userData
    Object.assign(user, {
      name: updateDetails.name || user.name,
      relation: updateDetails.relation || user.relation,
      email: updateDetails.email || user.email, // Update email if provided
    });

    // Save the updated user entity
    const updatedUser = await this.userRepository.save(user);

    return new UpdateUserResponse(
      'User details updated successfully',
      updatedUser,
    );
  }

  async updatePassword(
    userData: UserDto,
    passwords: UpdatePasswordDto,
  ): Promise<ActionResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userData.id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      passwords.currentPassword,
      user?.password || '',
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

    console.log('Password updated successfully for user:', userData.id);

    // Return success response
    return new ActionResponse('Password updated successfully');
  }

  async delete(userData: UserDto): Promise<ActionResponse> {
    console.log('Deleting user:', userData);

    const user = await this.userRepository.findOne({
      where: { id: userData.id },
    });
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.remove(user);

    return new ActionResponse('User deleted successfully');
  }
}
