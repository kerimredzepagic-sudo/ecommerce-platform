import { ICareer, EmploymentType } from '../models';

export interface CareerDTO {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  shortDescription: string;
  fullDescription: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  coverImage?: string;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  expiresAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  order: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CareerListDTO {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  shortDescription: string;
  coverImage?: string;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  expiresAt?: string;
  order: number;
  views: number;
  createdAt: string;
}

export function toCareerDTO(career: ICareer): CareerDTO {
  return {
    id: career._id.toString(),
    title: career.title,
    slug: career.slug,
    department: career.department,
    location: career.location,
    employmentType: career.employmentType,
    shortDescription: career.shortDescription,
    fullDescription: career.fullDescription,
    requirements: career.requirements,
    responsibilities: career.responsibilities,
    benefits: career.benefits,
    coverImage: career.coverImage,
    isActive: career.isActive,
    isFeatured: career.isFeatured,
    publishedAt: career.publishedAt?.toISOString(),
    expiresAt: career.expiresAt?.toISOString(),
    metaTitle: career.metaTitle,
    metaDescription: career.metaDescription,
    order: career.order,
    views: career.views,
    createdAt: career.createdAt.toISOString(),
    updatedAt: career.updatedAt.toISOString(),
  };
}

export function toCareerListDTO(career: ICareer): CareerListDTO {
  return {
    id: career._id.toString(),
    title: career.title,
    slug: career.slug,
    department: career.department,
    location: career.location,
    employmentType: career.employmentType,
    shortDescription: career.shortDescription,
    coverImage: career.coverImage,
    isActive: career.isActive,
    isFeatured: career.isFeatured,
    publishedAt: career.publishedAt?.toISOString(),
    expiresAt: career.expiresAt?.toISOString(),
    order: career.order,
    views: career.views,
    createdAt: career.createdAt.toISOString(),
  };
}

export function toCareerListDTOs(careers: ICareer[]): CareerListDTO[] {
  return careers.map(toCareerListDTO);
}
