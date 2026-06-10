import { TOrderStatus } from "@/redux/service/orders/type";

// Render order status
export const statusStyles: Record<TOrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-300",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-300",
  DELIVERED: "bg-green-100 text-green-800 border-green-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-300",
  RETURNED: "bg-sky-100 text-sky-800 border-sky-300",
  CONFIRMED: "bg-sky-100 text-sky-800 border-sky-300",
};