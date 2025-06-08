import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Hashtag } from './hashtag.entity';
export declare class Post {
    id: string;
    content: string;
    author: User;
    authorWalletAddress: string;
    comments: Comment[];
    likes: Like[];
    hashtags: Hashtag[];
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
    isLiked?: boolean;
}
