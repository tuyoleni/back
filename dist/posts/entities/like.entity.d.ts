import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';
export declare class Like {
    id: string;
    post: Post;
    postId: string;
    user: User;
    userWalletAddress: string;
    createdAt: Date;
}
