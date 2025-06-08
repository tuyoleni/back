import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post)
  post: Post;

  @Column()
  postId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userWalletAddress: string;

  @CreateDateColumn()
  createdAt: Date;
} 