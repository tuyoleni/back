import { Controller, Get, Post, Body, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { CreateCommentDto } from '../posts/dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.walletAddress);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.postsService.getPost(id, req.user?.walletAddress || '');
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.postsService.addComment(id, createCommentDto, req.user.walletAddress);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  toggleLike(@Param('id') id: string, @Request() req) {
    return this.postsService.toggleLike(id, req.user.walletAddress);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.postsService.remove(id, req.user.walletAddress);
  }
} 