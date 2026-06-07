import { Career, ICareer, EmploymentType } from '../models';
import { slugify, generateUniqueSlug } from '../utils';

export interface CreateCareerInput {
  title: string;
  slug?: string;
  department: string;
  location: string;
  employmentType?: EmploymentType;
  shortDescription: string;
  fullDescription: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  coverImage?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  expiresAt?: string | null;
  metaTitle?: string;
  metaDescription?: string;
  order?: number;
}

export interface CareerQuery {
  page?: number;
  limit?: number;
  department?: string;
  location?: string;
  employmentType?: EmploymentType;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

class CareerService {
  async create(input: CreateCareerInput): Promise<ICareer> {
    // Use provided slug or generate from title
    let slug = input.slug ? slugify(input.slug) : slugify(input.title);

    // Check if slug already exists
    const existingCareer = await Career.findOne({ slug });
    if (existingCareer) {
      slug = generateUniqueSlug(slug);
    }

    const career = await Career.create({
      ...input,
      slug,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
      publishedAt: input.isActive ? new Date() : undefined,
    });

    return career;
  }

  async getById(id: string): Promise<ICareer | null> {
    return Career.findById(id);
  }

  async getBySlug(slug: string): Promise<ICareer | null> {
    const career = await Career.findOne({ slug, isActive: true });

    if (career) {
      // Check if expired
      if (career.expiresAt && career.expiresAt < new Date()) {
        return null;
      }
      // Increment views
      career.views += 1;
      await career.save();
    }

    return career;
  }

  async getAll(query: CareerQuery): Promise<{ careers: ICareer[]; total: number }> {
    const { 
      page = 1, 
      limit = 10, 
      department, 
      location, 
      employmentType,
      search, 
      isActive, 
      isFeatured 
    } = query;

    const filter: Record<string, unknown> = {};

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    if (department) {
      filter.department = department;
    }

    if (location) {
      filter.location = location;
    }

    if (employmentType) {
      filter.employmentType = employmentType;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { fullDescription: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [careers, total] = await Promise.all([
      Career.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Career.countDocuments(filter),
    ]);

    return { careers, total };
  }

  async getPublicCareers(query: CareerQuery = {}): Promise<{ careers: ICareer[]; total: number }> {
    const { 
      page = 1, 
      limit = 10, 
      department, 
      location, 
      employmentType,
      search,
      isFeatured 
    } = query;

    const now = new Date();
    const filter: Record<string, unknown> = {
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: now } },
      ],
    };

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    if (department) {
      filter.department = department;
    }

    if (location) {
      filter.location = location;
    }

    if (employmentType) {
      filter.employmentType = employmentType;
    }

    if (search) {
      filter.$and = [
        { $or: filter.$or as object[] },
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { shortDescription: { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } },
          ],
        },
      ];
      delete filter.$or;
    }

    const skip = (page - 1) * limit;

    const [careers, total] = await Promise.all([
      Career.find(filter)
        .sort({ isFeatured: -1, order: 1, publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      Career.countDocuments(filter),
    ]);

    return { careers, total };
  }

  async getFeatured(limit = 5): Promise<ICareer[]> {
    const now = new Date();
    return Career.find({
      isActive: true,
      isFeatured: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: now } },
      ],
    })
      .sort({ order: 1, publishedAt: -1 })
      .limit(limit);
  }

  async update(id: string, updates: Partial<CreateCareerInput>): Promise<ICareer | null> {
    const updateData: Record<string, unknown> = { ...updates };

    // Handle slug generation if title changes
    if (updates.title && !updates.slug) {
      const slug = slugify(updates.title);
      const existingCareer = await Career.findOne({ slug, _id: { $ne: id } });
      if (existingCareer) {
        updateData.slug = generateUniqueSlug(slug);
      } else {
        updateData.slug = slug;
      }
    } else if (updates.slug) {
      const slug = slugify(updates.slug);
      const existingCareer = await Career.findOne({ slug, _id: { $ne: id } });
      if (existingCareer) {
        updateData.slug = generateUniqueSlug(slug);
      } else {
        updateData.slug = slug;
      }
    }

    // Handle expiresAt
    if (updates.expiresAt !== undefined) {
      updateData.expiresAt = updates.expiresAt ? new Date(updates.expiresAt) : null;
    }

    // Handle publishing
    if (updates.isActive === true) {
      const career = await Career.findById(id);
      if (career && !career.isActive) {
        updateData.publishedAt = new Date();
      }
    }

    return Career.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Career.findByIdAndDelete(id);
    return !!result;
  }

  async getDepartments(): Promise<string[]> {
    const departments = await Career.distinct('department', { isActive: true });
    return departments.sort();
  }

  async getLocations(): Promise<string[]> {
    const locations = await Career.distinct('location', { isActive: true });
    return locations.sort();
  }

  async toggleActive(id: string): Promise<ICareer | null> {
    const career = await Career.findById(id);
    if (!career) return null;

    career.isActive = !career.isActive;
    if (career.isActive && !career.publishedAt) {
      career.publishedAt = new Date();
    }
    await career.save();

    return career;
  }

  async toggleFeatured(id: string): Promise<ICareer | null> {
    const career = await Career.findById(id);
    if (!career) return null;

    career.isFeatured = !career.isFeatured;
    await career.save();

    return career;
  }
}

export const careerService = new CareerService();
