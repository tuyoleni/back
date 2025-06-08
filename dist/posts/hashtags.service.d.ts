import { Repository } from 'typeorm';
import { Hashtag } from './entities/hashtag.entity';
export declare class HashtagsService {
    private hashtagsRepository;
    constructor(hashtagsRepository: Repository<Hashtag>);
    findOrCreate(name: string): Promise<Hashtag>;
    decrementUsage(name: string): Promise<Hashtag>;
    getPopularHashtags(limit?: number): Promise<Hashtag[]>;
    searchHashtags(query: string, limit?: number): Promise<Hashtag[]>;
}
