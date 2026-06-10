export interface OrdersByStatus {
  PENDING: number
  CONFIRMED: number
  PROCESSING: number
  SHIPPED: number
  DELIVERED: number
  CANCELLED: number
  RETURNED: number
}


export interface DashboardAnalytics {
  totalOrders: number
  totalShopping: number
  totalSaving: number
  ordersByStatus: OrdersByStatus
}




export interface IAnalayticsResponse {
  success: boolean
  message: string
  data: DashboardAnalytics
}
