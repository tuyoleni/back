import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { HashtagsService } from './hashtags.service';
export declare class PostsService {
    private postsRepository;
    private commentsRepository;
    private likesRepository;
    private usersRepository;
    private hashtagsService;
    constructor(postsRepository: Repository<Post>, commentsRepository: Repository<Comment>, likesRepository: Repository<Like>, usersRepository: Repository<User>, hashtagsService: HashtagsService);
    findAll(walletAddress: string, hashtag?: string): Promise<Post[]>;
    findOne(id: string, walletAddress: string): Promise<Post>;
    create(createPostDto: CreatePostDto): Promise<Post>;
    archive(id: string, walletAddress: string): Promise<Post>;
    delete(id: string, walletAddress: string): Promise<void>;
    addComment(postId: string, createCommentDto: CreateCommentDto): Promise<Comment>;
    toggleLike(postId: string, walletAddress: string): Promise<Post>;
}
