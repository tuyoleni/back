import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { HashtagsService } from './hashtags.service';

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
    private hashtagsService: HashtagsService,
  ) {}

  async findAll(walletAddress: string, hashtag?: string): Promise<Post[]> {
    const queryBuilder = this.postsRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('post.hashtags', 'hashtags')
      .where('post.isArchived = :isArchived', { isArchived: false });

    if (hashtag) {
      queryBuilder
        .innerJoin('post.hashtags', 'hashtag')
        .andWhere('hashtag.name = :hashtag', { hashtag: hashtag.toLowerCase() });
    }

    const posts = await queryBuilder
      .orderBy('post.createdAt', 'DESC')
      .getMany();

    return posts.map(post => ({
      ...post,
      isLiked: post.likes.some(like => like.userWalletAddress === walletAddress),
    }));
  }

  async findOne(id: string, walletAddress: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id, isArchived: false },
      relations: ['author', 'comments', 'likes', 'hashtags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return {
      ...post,
      isLiked: post.likes.some(like => like.userWalletAddress === walletAddress),
    };
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    let author = await this.usersRepository.findOne({
      where: { walletAddress: createPostDto.walletAddress },
    });

    if (!author) {
      // Create a new user if they don't exist
      author = this.usersRepository.create({
        walletAddress: createPostDto.walletAddress,
        username: createPostDto.walletAddress.slice(0, 8), // Use first 8 chars of wallet as default username
      });
      author = await this.usersRepository.save(author);
    }

    // Extract hashtags from content (match # followed by word characters)
    const hashtagRegex = /#(\w+)/g;
    const hashtagMatches = createPostDto.content.match(hashtagRegex) || [];
    const hashtagNames = hashtagMatches.map(tag => tag.slice(1).toLowerCase()); // Remove # and convert to lowercase
    
    // Create or find hashtags and increment their usage
    const hashtags = await Promise.all(
      hashtagNames.map(name => this.hashtagsService.findOrCreate(name))
    );

    const post = this.postsRepository.create({
      ...createPostDto,
      author,
      hashtags,
    });

    return this.postsRepository.save(post);
  }

  async archive(id: string, walletAddress: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'hashtags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.authorWalletAddress !== walletAddress) {
      throw new UnauthorizedException('You can only archive your own posts');
    }

    // Decrement hashtag usage counts
    await Promise.all(
      post.hashtags.map(hashtag => 
        this.hashtagsService.decrementUsage(hashtag.name)
      )
    );

    post.isArchived = true;
    return this.postsRepository.save(post);
  }

  async delete(id: string, walletAddress: string): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'hashtags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.authorWalletAddress !== walletAddress) {
      throw new UnauthorizedException('You can only delete your own posts');
    }

    // Decrement hashtag usage counts
    await Promise.all(
      post.hashtags.map(hashtag => 
        this.hashtagsService.decrementUsage(hashtag.name)
      )
    );

    await this.postsRepository.remove(post);
  }

  async addComment(postId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.postsRepository.findOne({
      where: { id: postId, isArchived: false },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    let author = await this.usersRepository.findOne({
      where: { walletAddress: createCommentDto.walletAddress },
    });

    if (!author) {
      // Create a new user if they don't exist
      author = this.usersRepository.create({
        walletAddress: createCommentDto.walletAddress,
        username: createCommentDto.walletAddress.slice(0, 8), // Use first 8 chars of wallet as default username
      });
      author = await this.usersRepository.save(author);
    }

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      post,
      author,
    });

    return this.commentsRepository.save(comment);
  }

  async toggleLike(postId: string, walletAddress: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id: postId, isArchived: false },
      relations: ['likes'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const existingLike = post.likes.find(like => like.userWalletAddress === walletAddress);

    if (existingLike) {
      await this.likesRepository.remove(existingLike);
      post.likes = post.likes.filter(like => like.id !== existingLike.id);
    } else {
      const like = this.likesRepository.create({
        post,
        userWalletAddress: walletAddress,
      });
      const savedLike = await this.likesRepository.save(like);
      post.likes.push(savedLike);
    }

    return post;
  }
} 
 