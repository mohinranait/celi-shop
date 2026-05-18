import { IMetaPagination } from "@/global"
import { TProductType } from "../products/type"
import { TCheckoutForm } from "@/components/validations/checkout"


export type TOrderStatus = "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";
export interface ICartItem {
  productId: string
  productName: string
  productImage: string
  productSlug: string
  sku: string
  quantity: number;
  price: number
  salePrice: number;
  productType: TProductType
  selectedVariants?: Record<string, string>;
  variationId?: string | null;
  freeShipping?: boolean;
}




/* -------------------------------------------------------------------------- */
/*                               ORDER ITEM TYPE                              */
/* -------------------------------------------------------------------------- */

interface IOrderItem extends Omit<ICartItem, "productType"> {
  _id: string;
  categoryName?: string;
  brandName?: string;
}

/* -------------------------------------------------------------------------- */
/*                           SHIPPING ADDRESS TYPE                            */
/* -------------------------------------------------------------------------- */

export interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  postalCode?: string;
}

/* -------------------------------------------------------------------------- */
/*                              PAYMENT TYPE                                  */
/* -------------------------------------------------------------------------- */

export type TPaymentMethod =  "COD" | "BKASH" | "NAGAD";
export type TPaymentStatus =  "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export interface IPayment {
  method: TPaymentMethod;
  status: TPaymentStatus;
  transactionId?: string;
  paidAt?: Date | null;
}

/* -------------------------------------------------------------------------- */
/*                                COUPON TYPE                                 */
/* -------------------------------------------------------------------------- */

export interface ICoupon {
  code?: string;

  discountAmount?: number;
}

/* -------------------------------------------------------------------------- */
/*                               PRICING TYPE                                 */
/* -------------------------------------------------------------------------- */

export interface IOrderPricing {
  subtotal: number;

  discount: number;

  shippingCharge: number;

  tax: number;

  total: number;
}

/* -------------------------------------------------------------------------- */
/*                               ORDER TYPE                                   */
/* -------------------------------------------------------------------------- */

export interface IOrder {
  _id: string;

  userId?: string | null;

  items: IOrderItem[];

  totalItems: number;

  totalQuantity: number;

  pricing: IOrderPricing;

  coupon?: ICoupon;

  shippingAddress: IShippingAddress;

  payment: IPayment;

  orderStatus: TOrderStatus;

  invoiceNumber: string;

  trackingNumber?: string;

  courierName?: string;

  estimatedDeliveryDate?: Date | null;

  customerNote?: string;

  adminNote?: string;

  deliveredAt?: Date | null;

  cancelledAt?: Date | null;

  isDeleted?: boolean;

  createdAt: Date;

  updatedAt: Date;
}



export interface ICehckoutForm extends TCheckoutForm {
  items: ICartItem[]
}

// Order list response
export interface IOrderListResponse {
  data: IOrder[];
  meta: IMetaPagination;
}

// Order details response
export interface IOrderDetailsResponse {
  data: IOrder;
}