import { IMetaPagination } from "@/global";

// Base brand
export interface IAttributeBase {
  name: string;       
  displayName: string; 
  description?: string;
  values: string[]; 
  status: boolean;
  isDelete: boolean;  
  priority?:number;
}





export interface IAttribute extends IAttributeBase {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttributeResponse {
  success: boolean;
  data: IAttribute[];
  message?: string;
  meta: IMetaPagination;
}