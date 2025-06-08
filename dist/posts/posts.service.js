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
let PostsService = class PostsService {
    constructor(postsRepository, commentsRepository, likesRepository, usersRepository) {
        this.postsRepository = postsRepository;
        this.commentsRepository = commentsRepository;
        this.likesRepository = likesRepository;
        this.usersRepository = usersRepository;
    }
    async create(createPostDto, walletAddress) {
        const user = await this.usersRepository.findOne({ where: { walletAddress } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const post = this.postsRepository.create(Object.assign(Object.assign({}, createPostDto), { author: user }));
        return this.postsRepository.save(post);
    }
    async findAll() {
        return this.postsRepository.find({
            relations: ['author', 'comments', 'likes'],
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async getPost(id, walletAddress) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['likes', 'comments', 'comments.author'],
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        const isLiked = await this.likesRepository.findOne({
            where: {
                post: { id },
                user: { walletAddress },
            },
        });
        return Object.assign(Object.assign({}, post), { isLiked: !!isLiked });
    }
    async addComment(id, createCommentDto, walletAddress) {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const user = await this.usersRepository.findOne({ where: { walletAddress } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const comment = this.commentsRepository.create(Object.assign(Object.assign({}, createCommentDto), { post, author: user }));
        return this.commentsRepository.save(comment);
    }
    async toggleLike(id, walletAddress) {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const user = await this.usersRepository.findOne({ where: { walletAddress } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingLike = await this.likesRepository.findOne({
            where: {
                post: { id },
                user: { walletAddress },
            },
        });
        if (existingLike) {
            await this.likesRepository.remove(existingLike);
            return { liked: false };
        }
        const like = this.likesRepository.create({
            post,
            user,
        });
        await this.likesRepository.save(like);
        return { liked: true };
    }
    async remove(id, walletAddress) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.author.walletAddress !== walletAddress) {
            throw new common_1.NotFoundException('Not authorized to delete this post');
        }
        await this.postsRepository.remove(post);
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
        typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map