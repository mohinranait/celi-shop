import { IMetaPagination } from "@/types/common.type";

export type TSliderType = "directImage" | "withImage" | "withoutImage"

// Base brand
export interface ISliderBase {
  title: string;
  description?: string;
  link?: string;
  buttonName?: string;
  sliderType?: TSliderType;
  status: boolean;
  image?: string;
  order?: number;
  isDelete: boolean;
}





export interface ISlider extends ISliderBase {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISliderResponse {
  success: boolean;
  data: ISlider[];
  message?: string;
  meta: IMetaPagination;
}