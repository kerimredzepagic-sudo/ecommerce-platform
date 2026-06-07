import { IBlogPost, IUser, IBlogCategory } from '../models';

export interface BlogCategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface BlogPostDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: string[];
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  
  // Publishing
  isPublished: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  isFeatured: boolean;
  allowComments: boolean;
  
  // Engagement
  views: number;
  readingTime?: number;
  relatedPosts?: {
    id: string;
    title: string;
    slug: string;
    coverImage?: string;
    excerpt?: string;
  }[];
  
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostListDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  author: {
    id: string;
    fullName: string;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  isFeatured: boolean;
  views: number;
  readingTime?: number;
}

export function toBlogCategoryDTO(category: IBlogCategory): BlogCategoryDTO {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    isActive: category.isActive,
    order: category.order,
  };
}

export function toBlogCategoryDTOs(categories: IBlogCategory[]): BlogCategoryDTO[] {
  return categories.map(toBlogCategoryDTO);
}

export function toBlogPostDTO(post: IBlogPost): BlogPostDTO {
  const author = post.author as unknown as IUser | null;
  const category = post.category as unknown as IBlogCategory | null;
  const relatedPosts = post.relatedPosts as unknown as IBlogPost[] | undefined;

  return {
    id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    author: author
      ? {
          id: author._id.toString(),
          firstName: author.firstName,
          lastName: author.lastName,
          fullName: `${author.firstName} ${author.lastName}`,
        }
      : null,
    category: category && category._id
      ? {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
        }
      : null,
    tags: post.tags,
    
    // SEO
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    canonicalUrl: post.canonicalUrl,
    ogImage: post.ogImage,
    
    // Publishing
    isPublished: post.isPublished,
    publishedAt: post.publishedAt?.toISOString(),
    scheduledAt: post.scheduledAt?.toISOString(),
    isFeatured: post.isFeatured,
    allowComments: post.allowComments,
    
    // Engagement
    views: post.views,
    readingTime: post.readingTime,
    relatedPosts: relatedPosts?.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      coverImage: p.coverImage,
      excerpt: p.excerpt,
    })),
    
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

export function toBlogPostListDTO(post: IBlogPost): BlogPostListDTO {
  const author = post.author as unknown as IUser | null;
  const category = post.category as unknown as IBlogCategory | null;

  return {
    id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    author: author
      ? {
          id: author._id.toString(),
          fullName: `${author.firstName} ${author.lastName}`,
        }
      : null,
    category: category && category._id
      ? {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
        }
      : null,
    tags: post.tags,
    isPublished: post.isPublished,
    publishedAt: post.publishedAt?.toISOString(),
    scheduledAt: post.scheduledAt?.toISOString(),
    isFeatured: post.isFeatured,
    views: post.views,
    readingTime: post.readingTime,
  };
}

export function toBlogPostListDTOs(posts: IBlogPost[]): BlogPostListDTO[] {
  return posts.map(toBlogPostListDTO);
}
