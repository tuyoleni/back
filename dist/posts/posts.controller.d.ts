import { PostsService } from './posts.service';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { CreateCommentDto } from '../posts/dto/create-comment.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: any): Promise<import("./entities/post.entity").Post>;
    findAll(): Promise<import("./entities/post.entity").Post[]>;
    findOne(id: string, req: any): Promise<import("./entities/post.entity").Post>;
    addComment(id: string, createCommentDto: CreateCommentDto, req: any): Promise<import("./entities/comment.entity").Comment>;
    toggleLike(id: string, req: any): Promise<{
        liked: boolean;
    }>;
    remove(id: string, req: any): Promise<void>;
}
