import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(req: any, hashtag?: string): Promise<import("./entities/post.entity").Post[]>;
    findOne(id: string, req: any): Promise<import("./entities/post.entity").Post>;
    create(createPostDto: CreatePostDto): Promise<import("./entities/post.entity").Post>;
    archive(id: string, req: any): Promise<import("./entities/post.entity").Post>;
    delete(id: string, req: any): Promise<void>;
    addComment(id: string, createCommentDto: CreateCommentDto): Promise<import("./entities/comment.entity").Comment>;
    toggleLike(id: string, req: any): Promise<import("./entities/post.entity").Post>;
}
