import { IMetaPagination } from "@/types/common.type";


export interface IBaseCategory {
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  thumbnail?:string;
  banner?: string; 
  status: boolean;
  priority?: number;
  level: number;
  path : string[]
}


export interface ICategory extends IBaseCategory {
  _id: string;
  totalProducts: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryListResponse {
  data: ICategory[]
  meta: IMetaPagination;
}