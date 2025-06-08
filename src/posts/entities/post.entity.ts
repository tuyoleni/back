import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 280 })
  content: string;

  @ManyToOne(() => User)
  author: User;

  @Column()
  authorWalletAddress: string;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, like => like.post)
  likes: Like[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  isLiked?: boolean;
} 