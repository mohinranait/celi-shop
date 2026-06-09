import { IMetaPagination } from "@/types/common.type";
import { IProduct } from "../products/type";

export interface IBaseRequestQuote {
  // productId: string;
  location: {
    address: string,
    zipCode: string,
    district: string,
  },
  request: {
    name: string,
    whatsappNumber: string,
    phone: string,
  },
  quantity: number,
  notes: string,
}


export interface IRequestQuote extends IBaseRequestQuote {
  _id: string,
  createdAt: string;
  updatedAt: string;
  productId: IProduct
}

export interface IRequestQuoteListResponse {
  data: IRequestQuote[];
   meta: IMetaPagination;
}