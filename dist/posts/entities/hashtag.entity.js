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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hashtag = void 0;
const typeorm_1 = require("typeorm");
const post_entity_1 = require("./post.entity");
let Hashtag = class Hashtag {
};
exports.Hashtag = Hashtag;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Hashtag.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Hashtag.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Hashtag.prototype, "usageCount", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => post_entity_1.Post, post => post.hashtags),
    (0, typeorm_1.JoinTable)({
        name: 'post_hashtags',
        joinColumn: { name: 'hashtag_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Hashtag.prototype, "posts", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Hashtag.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Hashtag.prototype, "updatedAt", void 0);
exports.Hashtag = Hashtag = __decorate([
    (0, typeorm_1.Entity)()
], Hashtag);
//# sourceMappingURL=hashtag.entity.js.map