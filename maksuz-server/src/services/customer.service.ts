import { Order } from '../models';

export interface CustomerStats {
  email: string;
  name: string;
  isRegistered: boolean;
  userId?: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: Date;
  firstOrderDate: Date;
}

export interface CustomerWithOrders extends CustomerStats {
  orders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: Date;
    itemCount: number;
  }>;
}

export interface CustomerQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'totalSpent' | 'orderCount' | 'lastOrderDate';
  sortOrder?: 'asc' | 'desc';
}

class CustomerService {
  async getAll(query: CustomerQuery): Promise<{ customers: CustomerStats[]; total: number }> {
    const { page = 1, limit = 20, search, sortBy = 'totalSpent', sortOrder = 'desc' } = query;

    const matchStage: Record<string, unknown> = {
      status: { $ne: 'cancelled' },
    };

    if (search) {
      matchStage.$or = [
        { guestEmail: { $regex: search, $options: 'i' } },
        { guestName: { $regex: search, $options: 'i' } },
        { 'userData.email': { $regex: search, $options: 'i' } },
        { 'userData.firstName': { $regex: search, $options: 'i' } },
        { 'userData.lastName': { $regex: search, $options: 'i' } },
      ];
    }

    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const aggregationPipeline = [
      // Lookup user data for registered orders
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData',
        },
      },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
      // Match non-cancelled orders
      { $match: matchStage },
      // Group by email (either user email or guest email)
      {
        $group: {
          _id: {
            $cond: [
              { $ifNull: ['$userData.email', false] },
              '$userData.email',
              '$guestEmail',
            ],
          },
          name: {
            $first: {
              $cond: [
                { $ifNull: ['$userData.firstName', false] },
                { $concat: ['$userData.firstName', ' ', '$userData.lastName'] },
                '$guestName',
              ],
            },
          },
          isRegistered: { $first: { $cond: [{ $ifNull: ['$user', false] }, true, false] } },
          userId: { $first: '$user' },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          lastOrderDate: { $max: '$createdAt' },
          firstOrderDate: { $min: '$createdAt' },
        },
      },
      // Filter out null emails
      { $match: { _id: { $ne: null } } },
      // Sort
      { $sort: { [sortBy]: sortDirection } as Record<string, 1 | -1> },
      // Facet for pagination and count
      {
        $facet: {
          customers: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                _id: 0,
                email: '$_id',
                name: 1,
                isRegistered: 1,
                userId: 1,
                orderCount: 1,
                totalSpent: 1,
                lastOrderDate: 1,
                firstOrderDate: 1,
              },
            },
          ],
          total: [{ $count: 'count' }],
        },
      },
    ];

    const result = await Order.aggregate(aggregationPipeline);
    const customers = result[0]?.customers || [];
    const total = result[0]?.total[0]?.count || 0;

    return { customers, total };
  }

  async getByEmail(email: string): Promise<CustomerWithOrders | null> {
    const aggregationPipeline = [
      // Lookup user data
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData',
        },
      },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
      // Match by email
      {
        $match: {
          $or: [
            { 'userData.email': { $regex: new RegExp(`^${email}$`, 'i') } },
            { guestEmail: { $regex: new RegExp(`^${email}$`, 'i') } },
          ],
        },
      },
      // Sort by date
      { $sort: { createdAt: -1 as const } },
      // Group to get customer info and orders
      {
        $group: {
          _id: null,
          email: {
            $first: {
              $cond: [
                { $ifNull: ['$userData.email', false] },
                '$userData.email',
                '$guestEmail',
              ],
            },
          },
          name: {
            $first: {
              $cond: [
                { $ifNull: ['$userData.firstName', false] },
                { $concat: ['$userData.firstName', ' ', '$userData.lastName'] },
                '$guestName',
              ],
            },
          },
          isRegistered: { $first: { $cond: [{ $ifNull: ['$user', false] }, true, false] } },
          userId: { $first: '$user' },
          orderCount: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [{ $ne: ['$status', 'cancelled'] }, '$total', 0],
            },
          },
          lastOrderDate: { $max: '$createdAt' },
          firstOrderDate: { $min: '$createdAt' },
          orders: {
            $push: {
              id: { $toString: '$_id' },
              orderNumber: '$orderNumber',
              total: '$total',
              status: '$status',
              paymentStatus: '$paymentStatus',
              createdAt: '$createdAt',
              itemCount: { $size: '$items' },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          email: 1,
          name: 1,
          isRegistered: 1,
          userId: 1,
          orderCount: 1,
          totalSpent: 1,
          lastOrderDate: 1,
          firstOrderDate: 1,
          orders: 1,
        },
      },
    ];

    const result = await Order.aggregate(aggregationPipeline);
    return result[0] || null;
  }
}

export const customerService = new CustomerService();

