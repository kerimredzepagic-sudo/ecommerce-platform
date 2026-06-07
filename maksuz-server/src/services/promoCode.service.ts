import { PromoCode, IPromoCode, PromoCodeType } from '../models';

export interface CreatePromoCodeInput {
  code: string;
  type: PromoCodeType;
  value: number;
  minOrderAmount?: number;
  maxUses?: number | null;
  validFrom: Date;
  validUntil: Date;
}

export interface PromoCodeQuery {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface ValidatePromoCodeResult {
  valid: boolean;
  code?: IPromoCode;
  error?: string;
  discount?: {
    type: PromoCodeType;
    value: number;
    freeShipping: boolean;
  };
}

class PromoCodeService {
  async create(input: CreatePromoCodeInput): Promise<IPromoCode> {
    const existingCode = await PromoCode.findOne({ code: input.code.toUpperCase() });
    if (existingCode) {
      throw new Error('Promo code already exists');
    }

    const promoCode = await PromoCode.create({
      code: input.code.toUpperCase(),
      type: input.type,
      value: input.value,
      minOrderAmount: input.minOrderAmount || 0,
      maxUses: input.maxUses ?? null,
      validFrom: input.validFrom,
      validUntil: input.validUntil,
    });

    return promoCode;
  }

  async getAll(query: PromoCodeQuery): Promise<{ promoCodes: IPromoCode[]; total: number }> {
    const { page = 1, limit = 20, isActive } = query;

    const filter: Record<string, unknown> = {};
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const skip = (page - 1) * limit;

    const [promoCodes, total] = await Promise.all([
      PromoCode.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      PromoCode.countDocuments(filter),
    ]);

    return { promoCodes, total };
  }

  async getById(id: string): Promise<IPromoCode | null> {
    return PromoCode.findById(id);
  }

  async getByIdWithOrders(id: string): Promise<IPromoCode | null> {
    return PromoCode.findById(id).populate({
      path: 'usedInOrders',
      select: 'orderNumber total status createdAt shippingAddress guestEmail guestName user',
      populate: {
        path: 'user',
        select: 'firstName lastName email',
      },
    });
  }

  async getByCode(code: string): Promise<IPromoCode | null> {
    return PromoCode.findOne({ code: code.toUpperCase() });
  }

  async validateCode(code: string, orderAmount: number): Promise<ValidatePromoCodeResult> {
    const promoCode = await this.getByCode(code);

    if (!promoCode) {
      return { valid: false, error: 'Promo kod ne postoji' };
    }

    if (!promoCode.isActive) {
      return { valid: false, error: 'Promo kod nije aktivan' };
    }

    const now = new Date();
    if (now < promoCode.validFrom) {
      return { valid: false, error: 'Promo kod još nije validan' };
    }

    if (now > promoCode.validUntil) {
      return { valid: false, error: 'Promo kod je istekao' };
    }

    if (promoCode.maxUses !== null && promoCode.usedCount >= promoCode.maxUses) {
      return { valid: false, error: 'Promo kod je iskorišten maksimalni broj puta' };
    }

    if (orderAmount < promoCode.minOrderAmount) {
      return { 
        valid: false, 
        error: `Minimalni iznos narudžbe za ovaj kod je ${promoCode.minOrderAmount} KM` 
      };
    }

    return {
      valid: true,
      code: promoCode,
      discount: {
        type: promoCode.type,
        value: promoCode.value,
        freeShipping: promoCode.type === 'free_shipping',
      },
    };
  }

  async incrementUsage(id: string): Promise<void> {
    await PromoCode.findByIdAndUpdate(id, { $inc: { usedCount: 1 } });
  }

  async update(id: string, data: Partial<CreatePromoCodeInput> & { isActive?: boolean }): Promise<IPromoCode | null> {
    const updateData: Record<string, unknown> = {};
    
    if (data.code) updateData.code = data.code.toUpperCase();
    if (data.type) updateData.type = data.type;
    if (data.value !== undefined) updateData.value = data.value;
    if (data.minOrderAmount !== undefined) updateData.minOrderAmount = data.minOrderAmount;
    if (data.maxUses !== undefined) updateData.maxUses = data.maxUses;
    if (data.validFrom) updateData.validFrom = data.validFrom;
    if (data.validUntil) updateData.validUntil = data.validUntil;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return PromoCode.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await PromoCode.findByIdAndDelete(id);
    return !!result;
  }

  async toggleActive(id: string): Promise<IPromoCode | null> {
    const promoCode = await PromoCode.findById(id);
    if (!promoCode) return null;

    promoCode.isActive = !promoCode.isActive;
    await promoCode.save();
    return promoCode;
  }
}

export const promoCodeService = new PromoCodeService();

