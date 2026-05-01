
export interface IMedia {
  _id: string;
  fileUrl: string;
  width: number;
  height: number;
  extension: string;
  size: number;
  public_id: string;
  secure_url: string;
}

export interface IMediaListResponse  {
  data: {medias: IMedia[] } 
}