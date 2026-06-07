import { Contact, IContact } from '../models';

export interface CreateContactInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactQuery {
  page?: number;
  limit?: number;
  status?: IContact['status'];
}

class ContactService {
  async create(input: CreateContactInput): Promise<IContact> {
    return Contact.create(input);
  }

  async getById(id: string): Promise<IContact | null> {
    return Contact.findById(id);
  }

  async getAll(query: ContactQuery): Promise<{ contacts: IContact[]; total: number }> {
    const { page = 1, limit = 20, status } = query;

    const filter: Record<string, unknown> = {};
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    return { contacts, total };
  }

  async updateStatus(id: string, status: IContact['status']): Promise<IContact | null> {
    const updateData: Record<string, unknown> = { status };

    if (status === 'replied') {
      updateData.repliedAt = new Date();
    }

    return Contact.findByIdAndUpdate(id, updateData, { new: true });
  }

  async markAsRead(id: string): Promise<IContact | null> {
    return Contact.findByIdAndUpdate(id, { status: 'read' }, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Contact.findByIdAndDelete(id);
    return !!result;
  }

  async getNewCount(): Promise<number> {
    return Contact.countDocuments({ status: 'new' });
  }
}

export const contactService = new ContactService();

