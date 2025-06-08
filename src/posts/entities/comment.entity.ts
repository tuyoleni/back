import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 280 })
  content: string;

  @ManyToOne(() => User)
  author: User;

  @Column()
  authorWalletAddress: string;

  @ManyToOne(() => Post, post => post.comments)
  post: Post;

  @Column()
  postId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 