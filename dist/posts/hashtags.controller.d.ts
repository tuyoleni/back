import { HashtagsService } from './hashtags.service';
export declare class HashtagsController {
    private readonly hashtagsService;
    constructor(hashtagsService: HashtagsService);
    getPopularHashtags(limit?: number): Promise<{
        name: string;
        usageCount: number;
    }[]>;
    searchHashtags(query: string, limit?: number): Promise<{
        name: string;
        usageCount: number;
    }[]>;
}
