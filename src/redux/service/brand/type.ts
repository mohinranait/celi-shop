
// Base brand
export interface IBrandBase {
  name: string;
  slug: string;
  description?: string;
  status: boolean;
  logo?: string;
  banner?: string;
  priority: string;
  isDelete: boolean;
}



export interface ISoftDelete {
  isDelete: boolean;
}

export interface IBrand extends IBrandBase {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBrandResponse {
  success: boolean;
  data: IBrand[];
  message?: string;
}