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
exports.HashtagsController = void 0;
const common_1 = require("@nestjs/common");
const hashtags_service_1 = require("./hashtags.service");
let HashtagsController = class HashtagsController {
    constructor(hashtagsService) {
        this.hashtagsService = hashtagsService;
    }
    async getPopularHashtags(limit) {
        const hashtags = await this.hashtagsService.getPopularHashtags(limit);
        return hashtags.map(hashtag => ({
            name: hashtag.name,
            usageCount: hashtag.usageCount,
        }));
    }
    async searchHashtags(query, limit) {
        const hashtags = await this.hashtagsService.searchHashtags(query, limit);
        return hashtags.map(hashtag => ({
            name: hashtag.name,
            usageCount: hashtag.usageCount,
        }));
    }
};
exports.HashtagsController = HashtagsController;
__decorate([
    (0, common_1.Get)('popular'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HashtagsController.prototype, "getPopularHashtags", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], HashtagsController.prototype, "searchHashtags", null);
exports.HashtagsController = HashtagsController = __decorate([
    (0, common_1.Controller)('hashtags'),
    __metadata("design:paramtypes", [hashtags_service_1.HashtagsService])
], HashtagsController);
//# sourceMappingURL=hashtags.controller.js.map