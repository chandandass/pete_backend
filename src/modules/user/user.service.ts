import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/user.dto';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Child } from 'src/entities/child.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Child) private readonly childRepository: Repository<Child>,
        private readonly connection: Connection, // Injecting connection
      ) {}
    
    async signUp(signUpData: SignUpDto): Promise<User> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
        // Create the User entity
        const user = this.userRepository.create({
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
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
    
        // Commit the transaction
        await queryRunner.commitTransaction();

        return user;
    } catch (error) {
        // Rollback the transaction in case of an error
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        // Release the query runner to free up resources
        await queryRunner.release();
    }
    }


}
