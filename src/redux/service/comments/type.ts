import { Types } from "mongoose";

export interface IBaseComment {
  productId: Types.ObjectId,
  userId: Types.ObjectId,
  comment: string,
  rating: number,
  isApproved: boolean,
}

export interface IComment extends IBaseComment {
  _id: string;
  createdAt: string;

}

export interface ICommentListResponse extends IComment {
  data: IComment[]
}