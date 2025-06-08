import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { CreateCommentDto } from '../posts/dto/create-comment.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto, walletAddress: string): Promise<Post> {
    const user = await this.usersRepository.findOne({ where: { walletAddress } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      author: user,
    });

    return this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['author', 'comments', 'likes'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getPost(id: string, walletAddress: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['likes', 'comments', 'comments.author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const isLiked = await this.likesRepository.findOne({
      where: {
        post: { id },
        user: { walletAddress },
      },
    });

    return {
      ...post,
      isLiked: !!isLiked,
    };
  }

  async addComment(id: string, createCommentDto: CreateCommentDto, walletAddress: string): Promise<Comment> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.usersRepository.findOne({ where: { walletAddress } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      post,
      author: user,
    });

    return this.commentsRepository.save(comment);
  }

  async toggleLike(id: string, walletAddress: string): Promise<{ liked: boolean }> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.usersRepository.findOne({ where: { walletAddress } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingLike = await this.likesRepository.findOne({
      where: {
        post: { id },
        user: { walletAddress },
      },
    });

    if (existingLike) {
      await this.likesRepository.remove(existingLike);
      return { liked: false };
    }

    const like = this.likesRepository.create({
      post,
      user,
    });

    await this.likesRepository.save(like);
    return { liked: true };
  }

  async remove(id: string, walletAddress: string): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.walletAddress !== walletAddress) {
      throw new NotFoundException('Not authorized to delete this post');
    }

    await this.postsRepository.remove(post);
  }
} 
 