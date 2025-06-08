import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(walletAddress: string): Promise<User> {
    return this.usersRepository.findOne({ where: { walletAddress } });
  }

  async createOrUpdate(userData: Partial<User>): Promise<User> {
    const user = await this.findOne(userData.walletAddress);
    if (user) {
      Object.assign(user, userData);
      return this.usersRepository.save(user);
    }
    return this.usersRepository.save(userData);
  }
} 