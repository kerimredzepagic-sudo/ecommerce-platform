import { ICategory } from '../models';

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  level: number;
  parent: { id: string; name: string; slug: string; level?: number } | null;
  ancestors?: Array<{ id: string; name: string; slug: string; level?: number }>;
  isActive: boolean;
  order: number;
}

export function toCategoryDTO(category: ICategory): CategoryDTO {
  const parent = category.parent as unknown as ICategory | null;
  const ancestors = category.ancestors as unknown as ICategory[] | undefined;

  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    level: category.level || 1,
    parent: parent && parent._id
      ? { id: parent._id.toString(), name: parent.name, slug: parent.slug, level: parent.level }
      : null,
    ancestors: ancestors?.map((a: ICategory) => ({
      id: a._id?.toString() || '',
      name: a.name || '',
      slug: a.slug || '',
      level: a.level,
    })).filter(a => a.id),
    isActive: category.isActive,
    order: category.order,
  };
}

export function toCategoryDTOs(categories: ICategory[]): CategoryDTO[] {
  return categories.map(toCategoryDTO);
}
