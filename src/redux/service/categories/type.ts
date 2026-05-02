import { IMetaPagination } from "@/global";

export interface IBaseCategory {
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  thumbnail?:string;
  banner?: string; 
  status: boolean;
  priority?: number;
}


export interface ICategory extends IBaseCategory {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryListResponse {
  data: ICategory[]
   meta: IMetaPagination;
}