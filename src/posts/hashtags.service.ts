import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hashtag } from './entities/hashtag.entity';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtag)
    private hashtagsRepository: Repository<Hashtag>,
  ) {}

  async findOrCreate(name: string): Promise<Hashtag> {
    const normalizedName = name.toLowerCase();
    let hashtag = await this.hashtagsRepository.findOne({
      where: { name: normalizedName },
    });

    if (!hashtag) {
      hashtag = this.hashtagsRepository.create({
        name: normalizedName,
        usageCount: 1,
      });
    } else {
      hashtag.usageCount += 1;
    }

    return this.hashtagsRepository.save(hashtag);
  }

  async decrementUsage(name: string): Promise<Hashtag> {
    const hashtag = await this.hashtagsRepository.findOne({
      where: { name: name.toLowerCase() },
    });

    if (hashtag) {
      hashtag.usageCount = Math.max(0, hashtag.usageCount - 1);
      return this.hashtagsRepository.save(hashtag);
    }

    return null;
  }

  async getPopularHashtags(limit: number = 10): Promise<Hashtag[]> {
    return this.hashtagsRepository.find({
      order: { usageCount: 'DESC' },
      take: limit,
    });
  }

  async searchHashtags(query: string, limit: number = 10): Promise<Hashtag[]> {
    return this.hashtagsRepository.find({
      where: { name: query.toLowerCase() },
      order: { usageCount: 'DESC' },
      take: limit,
    });
  }
} 