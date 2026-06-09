import { IMetaPagination } from "@/types/common.type";

// Base User
export interface IUserBase {
  name: string;
  phone: string;
  status: 'Active' | "Pending" | "Banned";
  role: "Admin" | "User"
}





export interface IUser extends IUserBase {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserResponse {
  success: boolean;
  data: IUser[];
  message?: string;
  meta: IMetaPagination;
}