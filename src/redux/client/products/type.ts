export interface IProductFilterParams {
  sort: string;
  page: number;
  limit: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}