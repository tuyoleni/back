import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(@Req() req, @Query('hashtag') hashtag?: string) {
    return this.postsService.findAll(req.user?.walletAddress, hashtag);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    return this.postsService.findOne(id, req.user?.walletAddress);
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Put(':id/archive')
  @UseGuards(JwtAuthGuard)
  async archive(@Param('id') id: string, @Req() req) {
    return this.postsService.archive(id, req.user.walletAddress);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Req() req) {
    return this.postsService.delete(id, req.user.walletAddress);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postsService.addComment(id, createCommentDto);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(@Param('id') id: string, @Req() req) {
    return this.postsService.toggleLike(id, req.user.walletAddress);
  }
} 