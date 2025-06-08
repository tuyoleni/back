import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  walletAddress: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profilePictureUrl: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  website: string;

  @Column({ default: 0 })
  postCount: number;

  @Column({ default: 0 })
  followerCount: number;

  @Column({ default: 0 })
  followingCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  commentCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 