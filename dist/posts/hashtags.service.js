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
exports.HashtagsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hashtag_entity_1 = require("./entities/hashtag.entity");
let HashtagsService = class HashtagsService {
    constructor(hashtagsRepository) {
        this.hashtagsRepository = hashtagsRepository;
    }
    async findOrCreate(name) {
        const normalizedName = name.toLowerCase();
        let hashtag = await this.hashtagsRepository.findOne({
            where: { name: normalizedName },
        });
        if (!hashtag) {
            hashtag = this.hashtagsRepository.create({
                name: normalizedName,
                usageCount: 1,
            });
        }
        else {
            hashtag.usageCount += 1;
        }
        return this.hashtagsRepository.save(hashtag);
    }
    async decrementUsage(name) {
        const hashtag = await this.hashtagsRepository.findOne({
            where: { name: name.toLowerCase() },
        });
        if (hashtag) {
            hashtag.usageCount = Math.max(0, hashtag.usageCount - 1);
            return this.hashtagsRepository.save(hashtag);
        }
        return null;
    }
    async getPopularHashtags(limit = 10) {
        return this.hashtagsRepository.find({
            order: { usageCount: 'DESC' },
            take: limit,
        });
    }
    async searchHashtags(query, limit = 10) {
        return this.hashtagsRepository.find({
            where: { name: query.toLowerCase() },
            order: { usageCount: 'DESC' },
            take: limit,
        });
    }
};
exports.HashtagsService = HashtagsService;
exports.HashtagsService = HashtagsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hashtag_entity_1.Hashtag)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HashtagsService);
//# sourceMappingURL=hashtags.service.js.map