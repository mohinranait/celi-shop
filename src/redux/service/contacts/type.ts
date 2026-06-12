import { IMetaPagination } from "@/types/common.type"

export interface IContact {
  _id: string
  fullName: string
  email: string
  phone: string
  orderNumber: string
  subject: string
  message: string
  createdAt: string
  updatedAt: string
}

export interface IContactListResponse {
  data: IContact[];
  meta: IMetaPagination ;
}