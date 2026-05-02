import { IMetaPagination } from "@/global";

// Base Product
export interface IProductBase {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  status: boolean;
  isDelete: boolean;
}





export interface IProduct extends IProductBase {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProductListResponse {
  success: boolean;
  data: IProduct[];
  message?: string;
  meta: IMetaPagination;
}