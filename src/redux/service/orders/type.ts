

export interface ICartItem {
  productId: string
  productName: string
  productImage: string
  productSlug: string
  sku: string
  quantity: number
  price: number
  salePrice: number
  selectedVariants?: Record<string, string>
}