import { Controller, Get, Query } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get('popular')
  async getPopularHashtags(@Query('limit') limit?: number) {
    const hashtags = await this.hashtagsService.getPopularHashtags(limit);
    return hashtags.map(hashtag => ({
      name: hashtag.name,
      usageCount: hashtag.usageCount,
    }));
  }

  @Get('search')
  async searchHashtags(
    @Query('query') query: string,
    @Query('limit') limit?: number,
  ) {
    const hashtags = await this.hashtagsService.searchHashtags(query, limit);
    return hashtags.map(hashtag => ({
      name: hashtag.name,
      usageCount: hashtag.usageCount,
    }));
  }
} 