import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from '../database/generated-types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('KYSELY_DB') private readonly db: Kysely<DB>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const result = await this.db
        .insertInto('users')
        .values(createUserDto)
        .returningAll()
        .executeTakeFirst();

      if (!result) {
        throw new BadRequestException('Failed to create user');
      }

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle duplicate key errors or other database constraints
      if (
        error.message?.includes('duplicate') ||
        error.message?.includes('unique')
      ) {
        throw new BadRequestException(
          'User with this information already exists',
        );
      }

      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll() {
    try {
      return await this.db.selectFrom('users').selectAll().execute();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findOne(id: number) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid user ID');
      }

      const user = await this.db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid user ID');
      }

      // First check if user exists
      const existingUser = await this.db
        .selectFrom('users')
        .select('id')
        .where('id', '=', id)
        .executeTakeFirst();

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const result = await this.db
        .updateTable('users')
        .set(updateUserDto)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();

      if (!result) {
        throw new InternalServerErrorException('Failed to update user');
      }

      return result;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      // Handle duplicate key errors or other database constraints
      if (
        error.message?.includes('duplicate') ||
        error.message?.includes('unique')
      ) {
        throw new BadRequestException('Update would create duplicate entry');
      }

      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: number) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid user ID');
      }

      // First check if user exists
      const existingUser = await this.db
        .selectFrom('users')
        .select('id')
        .where('id', '=', id)
        .executeTakeFirst();

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const result = await this.db
        .deleteFrom('users')
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();

      if (!result) {
        throw new InternalServerErrorException('Failed to delete user');
      }

      return result;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
