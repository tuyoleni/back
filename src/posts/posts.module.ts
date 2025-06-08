import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Hashtag } from './entities/hashtag.entity';
import { HashtagsService } from './hashtags.service';
import { HashtagsController } from './hashtags.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, Like, User, Hashtag]),
    UsersModule,
  ],
  controllers: [PostsController, HashtagsController],
  providers: [PostsService, HashtagsService],
  exports: [PostsService, HashtagsService],
})
export class PostsModule {} 