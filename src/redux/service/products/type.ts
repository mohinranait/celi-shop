import { IMetaPagination } from "@/global";

interface IProductSelectedVariant {
  attributeId: string,
  name: string,
  selectedValues: string[],
  _id: string
}


interface IProductVariant {
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
// Base Product
export interface IProductBase {
  name: string;
  slug: string;
  productType: "variant" | "single",
  shipping: {
    isFreeShipping: boolean;
  },
  seo: {
    keywords: string[]
  },
  ratings: {
    average: number,
    totalReviews: number;
  },
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