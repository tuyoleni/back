import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':wallet')
  async findOne(@Param('wallet') walletAddress: string): Promise<User> {
    return this.usersService.findOne(walletAddress);
  }

  @Post()
  async createOrUpdate(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.createOrUpdate(userData);
  }
} 