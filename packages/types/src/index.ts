// Generic API response
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Blog DTOs
export interface CreateBlogDto {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  published?: boolean;
}
export interface UpdateBlogDto extends Partial<CreateBlogDto> {}

// Testimonial DTOs
export interface CreateTestimonialDto {
  name: string;
  role?: string;
  content: string;
  rating: number;
  avatar?: string;
  featured?: boolean;
}
export interface UpdateTestimonialDto extends Partial<CreateTestimonialDto> {
  approved?: boolean;
}

// Gallery DTOs
export interface CreateGalleryImageDto {
  url: string;
  publicId: string;
  caption?: string;
  category?: string;
  order?: number;
}
