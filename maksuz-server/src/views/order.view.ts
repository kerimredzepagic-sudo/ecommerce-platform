import { IOrder, IUser } from '../models';

export interface OrderItemDTO {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  items: OrderItemDTO[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListDTO {
  id: string;
  orderNumber: string;
  itemCount: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export function toOrderDTO(order: IOrder): OrderDTO {
  const user = order.user as unknown as IUser | null;

  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    user: user
      ? {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      : null,
    items: order.items.map((item) => ({
      productId: item.product.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
      image: item.image,
    })),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    shippingAddress: order.shippingAddress,
    billingAddress: order.billingAddress,
    notes: order.notes,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

export function toOrderListDTO(order: IOrder): OrderListDTO {
  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt.toISOString(),
  };
}

export function toOrderListDTOs(orders: IOrder[]): OrderListDTO[] {
  return orders.map(toOrderListDTO);
}

