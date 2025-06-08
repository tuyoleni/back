export declare class CreatePostDto {
    content: string;
    category?: string;
    tags?: string[];
    imageUrl?: string;
    type?: 'text' | 'image' | 'image-text';
}
