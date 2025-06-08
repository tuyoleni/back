import { Post } from '../../posts/entities/post.entity';
export declare class User {
    walletAddress: string;
    username: string;
    bio: string;
    profilePictureUrl: string;
    location: string;
    website: string;
    postCount: number;
    followerCount: number;
    followingCount: number;
    likeCount: number;
    commentCount: number;
    posts: Post[];
    createdAt: Date;
    updatedAt: Date;
}
