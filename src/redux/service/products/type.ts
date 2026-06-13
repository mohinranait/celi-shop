import { IMetaPagination } from "@/types/common.type";

interface IProductSelectedVariant {
  attributeId: string,
  name: string,
  selectedValues: string[],
  _id: string
}


export interface IProductVariant {
  _id: string;
  name: string,
  price: number,
  offerPriceFixed: number,
  offerPriceParcent: number,
  costPrice: number,
  sku: string,
  stock: number,
  lowStockAlert: number,
  images: string[],
  isDefault: false
}


export type TProductType = "variant" | "single";
// Base Product
export interface IProductBase {
  name: string;
  slug: string;
  videoUrl?: string;
  productType: TProductType,
  gallery: string[];
  shipping: {
    isFreeShipping: boolean;
  },
  category: string,
  brand?: string,
  price?:number,
  discountPrice?:number,
  discountParcent?: number;
  seo: {
    keywords: string[]
  },
  ratings: {
    average: number,
    totalReviews: number;
  },
  shortDescription?: string;
  description?: string;
  logo?: string;
  stock: number,
  trackStock: boolean,
  tags: string[]
  isFeatured: boolean,
  status: boolean;
  isDelete: boolean;
  variations: IProductVariant[];
  selectedAttributes: IProductSelectedVariant[]
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


export interface IProductDetailsResponse {
  data: IProduct
}