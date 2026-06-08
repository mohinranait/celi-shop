export interface IFaq {
  _id: string
  title: string
  contents: string[]
  priority: number
  status: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IFaqListResponse {
  data: IFaq[];
}