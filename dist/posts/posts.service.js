"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./entities/post.entity");
const comment_entity_1 = require("./entities/comment.entity");
const like_entity_1 = require("./entities/like.entity");
const user_entity_1 = require("../users/entities/user.entity");
const hashtags_service_1 = require("./hashtags.service");
let PostsService = class PostsService {
    constructor(postsRepository, commentsRepository, likesRepository, usersRepository, hashtagsService) {
        this.postsRepository = postsRepository;
        this.commentsRepository = commentsRepository;
        this.likesRepository = likesRepository;
        this.usersRepository = usersRepository;
        this.hashtagsService = hashtagsService;
    }
    async findAll(walletAddress, hashtag) {
        const queryBuilder = this.postsRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('post.likes', 'likes')
            .leftJoinAndSelect('post.hashtags', 'hashtags')
            .where('post.isArchived = :isArchived', { isArchived: false });
        if (hashtag) {
            queryBuilder
                .innerJoin('post.hashtags', 'hashtag')
                .andWhere('hashtag.name = :hashtag', { hashtag: hashtag.toLowerCase() });
        }
        const posts = await queryBuilder
            .orderBy('post.createdAt', 'DESC')
            .getMany();
        return posts.map(post => (Object.assign(Object.assign({}, post), { isLiked: post.likes.some(like => like.userWalletAddress === walletAddress) })));
    }
    async findOne(id, walletAddress) {
        const post = await this.postsRepository.findOne({
            where: { id, isArchived: false },
            relations: ['author', 'comments', 'likes', 'hashtags'],
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        return Object.assign(Object.assign({}, post), { isLiked: post.likes.some(like => like.userWalletAddress === walletAddress) });
    }
    async create(createPostDto) {
        let author = await this.usersRepository.findOne({
            where: { walletAddress: createPostDto.walletAddress },
        });
        if (!author) {
            author = this.usersRepository.create({
                walletAddress: createPostDto.walletAddress,
                username: createPostDto.walletAddress.slice(0, 8),
            });
            author = await this.usersRepository.save(author);
        }
        const hashtagRegex = /#(\w+)/g;
        const hashtagMatches = createPostDto.content.match(hashtagRegex) || [];
        const hashtagNames = hashtagMatches.map(tag => tag.slice(1).toLowerCase());
        const hashtags = await Promise.all(hashtagNames.map(name => this.hashtagsService.findOrCreate(name)));
        const post = this.postsRepository.create(Object.assign(Object.assign({}, createPostDto), { author,
            hashtags }));
        return this.postsRepository.save(post);
    }
    async archive(id, walletAddress) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author', 'hashtags'],
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        if (post.authorWalletAddress !== walletAddress) {
            throw new common_1.UnauthorizedException('You can only archive your own posts');
        }
        await Promise.all(post.hashtags.map(hashtag => this.hashtagsService.decrementUsage(hashtag.name)));
        post.isArchived = true;
        return this.postsRepository.save(post);
    }
    async delete(id, walletAddress) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author', 'hashtags'],
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        if (post.authorWalletAddress !== walletAddress) {
            throw new common_1.UnauthorizedException('You can only delete your own posts');
        }
        await Promise.all(post.hashtags.map(hashtag => this.hashtagsService.decrementUsage(hashtag.name)));
        await this.postsRepository.remove(post);
    }
    async addComment(postId, createCommentDto) {
        const post = await this.postsRepository.findOne({
            where: { id: postId, isArchived: false },
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${postId} not found`);
        }
        let author = await this.usersRepository.findOne({
            where: { walletAddress: createCommentDto.walletAddress },
        });
        if (!author) {
            author = this.usersRepository.create({
                walletAddress: createCommentDto.walletAddress,
                username: createCommentDto.walletAddress.slice(0, 8),
            });
            author = await this.usersRepository.save(author);
        }
        const comment = this.commentsRepository.create(Object.assign(Object.assign({}, createCommentDto), { post,
            author }));
        return this.commentsRepository.save(comment);
    }
    async toggleLike(postId, walletAddress) {
        const post = await this.postsRepository.findOne({
            where: { id: postId, isArchived: false },
            relations: ['likes'],
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${postId} not found`);
        }
        const existingLike = post.likes.find(like => like.userWalletAddress === walletAddress);
        if (existingLike) {
            await this.likesRepository.remove(existingLike);
            post.likes = post.likes.filter(like => like.id !== existingLike.id);
        }
        else {
            const like = this.likesRepository.create({
                post,
                userWalletAddress: walletAddress,
            });
            const savedLike = await this.likesRepository.save(like);
            post.likes.push(savedLike);
        }
        return post;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(2, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        hashtags_service_1.HashtagsService])
], PostsService);
//# sourceMappingURL=posts.service.js.map