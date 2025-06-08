import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { CreateCommentDto } from '../posts/dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
export declare class PostsService {
    private postsRepository;
    private commentsRepository;
    private likesRepository;
    private usersRepository;
    constructor(postsRepository: Repository<Post>, commentsRepository: Repository<Comment>, likesRepository: Repository<Like>, usersRepository: Repository<User>);
    create(createPostDto: CreatePostDto, walletAddress: string): Promise<Post>;
    findAll(): Promise<Post[]>;
    getPost(id: string, walletAddress: string): Promise<Post>;
    addComment(id: string, createCommentDto: CreateCommentDto, walletAddress: string): Promise<Comment>;
    toggleLike(id: string, walletAddress: string): Promise<{
        liked: boolean;
    }>;
    remove(id: string, walletAddress: string): Promise<void>;
}
