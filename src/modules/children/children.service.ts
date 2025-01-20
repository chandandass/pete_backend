import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { Child } from '../../entities/child.entity';
import { User } from '../../entities/user.entity';
import { AddUpdateChildResponse, Children } from './dto/children.dto';
import { ActionResponse, BaseChildren } from '../shared/dto/shared.dto';
import { PromptHandler } from '../prompt/handler.service';
import { Post } from 'src/entities/post.entity';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
    private readonly promptHandler: PromptHandler,
  ) {}

  // Get children for a specific user
  async getChildren(userId: number): Promise<Child[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['children'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user.children;
  }

  // Add a new child for the user using queryRunner within a transaction
  async addChild(
    userId: number,
    createChildDto: BaseChildren,
  ): Promise<AddUpdateChildResponse> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('User not found');
      }

      const newChild = this.childRepository.create({
        ...createChildDto,
        parent_user: user,
      });

      await queryRunner.manager.save(Child, newChild);
      user.children = [newChild];

      const posts = await this.promptHandler.getAgePrompts(user);
      await queryRunner.manager.save(Post, posts);

      // Commit the transaction
      await queryRunner.commitTransaction();

      return new AddUpdateChildResponse('Child added successfully.', newChild);
    } catch (error) {
      // If an error occurs, rollback the transaction
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the queryRunner after the transaction is complete
      await queryRunner.release();
    }
  }

  // Update an existing child's details
  async updateChild(
    userId: number,
    updateChildDto: Children,
  ): Promise<AddUpdateChildResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['children'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    const child = user.children.find((child) => child.id === updateChildDto.id);
    if (!child) {
      throw new Error('Child not found');
    }

    child.name = updateChildDto.name;
    child.date_of_birth = updateChildDto.date_of_birth;
    child.gender = updateChildDto.gender;

    await this.childRepository.save(child);

    return new AddUpdateChildResponse('child updated succesfully', child);
  }

  // Delete a child for the user using queryRunner
  async deleteChild(userId: number, childId: number): Promise<ActionResponse> {
    // Start the transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Find the user with their children
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['children'],
      });
      if (!user) {
        throw new Error('User not found');
      }

      // Locate the child to delete
      const childIndex = user.children.findIndex(
        (child) => child.id === childId,
      );
      if (childIndex === -1) {
        throw new Error('Child not found');
      }

      const deletedChild = user.children[childIndex];

      // Remove the child relationship from the user's children array
      user.children.splice(childIndex, 1);

      // Save the updated user to reflect the removed child relationship
      await queryRunner.manager.save(User, user);

      // Remove the child entity from the database
      await queryRunner.manager.remove(Child, deletedChild);

      // Step 1: Delete associated media
      this.deleteMediaAndPosts(queryRunner, deletedChild.id, user.id);

      // Commit the transaction
      await queryRunner.commitTransaction();

      return {
        message: 'Child successfully deleted.',
      };
    } catch (error) {
      // Rollback the transaction in case of an error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the queryRunner after the transaction
      await queryRunner.release();
    }
  }
  private async deleteMediaAndPosts(
    queryRunner: QueryRunner,
    childId: number,
    userId: number,
  ): Promise<void> {
    // Step 1: Delete associated media
    await queryRunner.query(
      `DELETE FROM media WHERE post_id IN (
          SELECT id FROM posts WHERE child_id = $1 AND userId = $2
        )`,
      [childId, userId],
    );

    // Step 2: Delete the posts
    await queryRunner.query(
      `DELETE FROM posts WHERE child_id = $1 AND userId = $2`,
      [childId, userId],
    );
  }
}
