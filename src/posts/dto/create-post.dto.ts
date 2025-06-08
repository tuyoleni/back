import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(['text', 'image', 'image-text'])
  type?: 'text' | 'image' | 'image-text';

  @IsString()
  walletAddress: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];
} 