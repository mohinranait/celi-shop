
export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBrandResponse {
  success: boolean;
  data: IBrand[];
  message?: string;
}