import { Post } from './post.entity';
export declare class Hashtag {
    id: string;
    name: string;
    usageCount: number;
    posts: Post[];
    createdAt: Date;
    updatedAt: Date;
}
