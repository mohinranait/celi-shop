import { IProduct } from "../products/type";
import { IUser } from "@/models/user.model";
import { IMetaPagination } from "@/types/common.type";

export interface IBaseComment {

  comment: string,
  rating: number,
  isApproved: boolean,
  isFeature: boolean,
}

export interface IComment extends IBaseComment {
  _id: string;
  productId: IProduct,
  userId: IUser,
  createdAt: string;

}

export interface ICommentListResponse extends IComment {
  data: IComment[];
   meta: IMetaPagination;
}