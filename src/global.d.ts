declare module '*.css';



export interface ISoftDelete {
  isDelete: boolean,
}


export interface IMetaPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


