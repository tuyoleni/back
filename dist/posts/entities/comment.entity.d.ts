import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';
export declare class Comment {
    id: string;
    content: string;
    author: User;
    authorWalletAddress: string;
    post: Post;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
}
