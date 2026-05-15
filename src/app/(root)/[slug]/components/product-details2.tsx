'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, ShoppingCart, Heart, Share2, Check, Star, Handbag } from 'lucide-react'
import { IProduct, IProductVariant } from '@/redux/service/products/type'
import ImageGallary from './image-gallary'
import Breadcrumb from './Breadcrumb'
import { ICartItem } from '@/redux/service/orders/type'
import { useAppDispatch } from '@/hooks/hooks'
import { addToCart } from '@/redux/features/cartSlice'
import { CURRENCY } from '@/lib/envSecret'
import { useGetAppSettingQuery } from '@/redux/service/setting'
import { useRouter } from 'next/navigation'




export function ProductDetailss({ product }: { product: IProduct }) {
  const router = useRouter();
  const { data: appSetting } = useGetAppSettingQuery()
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1)
  const [selectedVariation, setSelectedVariation] = useState<IProductVariant | null>(
    product.productType === 'variant' && product.variations ? product.variations[0] : null
  )

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    if (product.productType === 'single' && product.selectedAttributes) {
      const defaults: Record<string, string> = {}
      product.selectedAttributes.forEach(attr => {
        defaults[attr.name] = attr.selectedValues[0] || ''
      })
      return defaults
    }
    return {}
  })

  const [isWishlisted, setIsWishlisted] = useState(false)

  const isVariant = product.productType === 'variant'
  const currentVariation = selectedVariation || (isVariant ? product.variations?.[0] : null)

  const price = isVariant
    ? currentVariation?.price || 0
    : product.price || 0

  const offerPrice = isVariant
    ? ((currentVariation?.price || 0) - (currentVariation?.offerPriceFixed || 0)) || 0
    : ((product?.price || 0) - (product?.discountPrice || 0)) || 0

  const discountPercent = isVariant
    ? currentVariation?.offerPriceParcent || 0
    : product.discountParcent || 0

  const stock = isVariant
    ? currentVariation?.stock || 0
    : product.stock || 0

  const images = isVariant
    ? currentVariation?.images || product.gallery
    : product.gallery

  const attributeGroups = product.selectedAttributes?.reduce((acc, attr) => {
    acc[attr.name] = attr.selectedValues
    return acc
  }, {} as Record<string, string[]>) || {}

  const handleVariationChange = (attr: string, value: string) => {
    if (product.productType === 'variant') {
      const newVariationName = Object.entries(attributeGroups)
        .map(([key, values]) => {
          if (key === attr) return value
          const current = selectedVariation?.name.split(' / ')
          const attrIndex = Object.keys(attributeGroups).indexOf(key)
          return current?.[attrIndex] || values[0]
        })
        .join(' / ')

      const variation = product.variations?.find(v => v.name === newVariationName)
      if (variation) setSelectedVariation(variation)
    } else {
      setSelectedAttributes(prev => ({
        ...prev,
        [attr]: value
      }))
    }
  }

  const areAllAttributesSelected = () => {
    if (product.productType === 'single' && product.selectedAttributes && product.selectedAttributes.length > 0) {
      return product.selectedAttributes.every(attr => selectedAttributes[attr.name])
    }
    return true
  }

  const handleAddToCart = (action:'cart'|"order" = 'cart') => {
    if (product.productType === 'single' && product.selectedAttributes && product.selectedAttributes.length > 0) {
      if (!areAllAttributesSelected()) {
        console.log('Please select all attributes before adding to cart')
        return
      }
    }

    const sku = isVariant ? currentVariation?.sku : 'N/A'

    let selectedVariantsObj: Record<string, string> = {}

    if (isVariant && currentVariation) {
      const variantParts = currentVariation.name.split(' / ')
      const attributeKeys = Object.keys(attributeGroups)
      attributeKeys.forEach((key, index) => {
        selectedVariantsObj[key] = variantParts[index] || ''
      })
    } else if (!isVariant && product.selectedAttributes) {
      selectedVariantsObj = { ...selectedAttributes }
    }

    const cartItem: ICartItem = {
      productId: product._id,
      productName: product.name,
      productSlug: product?.slug,
      sku: sku || 'N/A',
      quantity: quantity,
      price: price,
      productType: product.productType,
      salePrice: offerPrice,
      productImage: images[0],
      selectedVariants: Object.keys(selectedVariantsObj).length > 0 ? selectedVariantsObj : undefined,
      variationId: selectedVariation?._id || null,
    }


    dispatch(addToCart({ cart: cartItem }))

    if(action === 'order'){
      router.push('/checkout')
    }

  }



  return (
    <div className="min-h-screen ">

      <Breadcrumb name={product?.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6">
          <ImageGallary product={product} images={images} stock={stock} />

          <div className="flex flex-col space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.ratings.average)
                            ? 'text-yellow-400'
                            : 'text-muted-foreground'
                          }`} />
                      ))}
                    </div>
                    <span className="text-sm text-accent-foreground">
                      ({product.ratings.totalReviews} reviews)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-3 rounded-full bg-background border border-border  transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                      }`}
                  />
                </button>
              </div>

              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-accent-foreground">
                  {CURRENCY}{offerPrice}
                </span>
                {price > offerPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {CURRENCY}{price}
                    </span>
                    {discountPercent > 0 && (
                      <Badge className="" variant={"destructive"}>
                        {Math.round(discountPercent)}% OFF
                      </Badge>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                {product.shipping.isFreeShipping && (
                  <Badge variant="outline" className="border-green-200 bg-green-50">
                    <Check className="w-3 h-3 mr-1" />
                    Free Shipping
                  </Badge>
                )}
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {attributeGroups && Object.keys(attributeGroups).length > 0 && (
              <div className="space-y-3 border-t border-b border-border py-4">
                {Object.entries(attributeGroups).map(([attrName, values]) => (
                  <div key={attrName}>
                    <label className="text-sm font-semibold text-accent-foreground mb-2 block capitalize">
                      {attrName}
                      {!isVariant && product.selectedAttributes && product.selectedAttributes.length > 0 && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {values.map((value) => {
                        const isSelected = isVariant
                          ? selectedVariation?.name.includes(value)
                          : selectedAttributes[attrName] === value

                        return (
                          <Button
                            key={value}
                            variant={isSelected ? "default" : 'outline'}
                            onClick={() => handleVariationChange(attrName, value)}
                            className="rounded-lg border font-medium transition-all"
                          >
                            {value}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${stock > 10 ? 'text-green-600' : stock > 0 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                  {stock > 10 ? `Available stock` : stock > 0 ? 'Low stock' : 'Out of stock'}
                </span>
                {currentVariation && (
                  <span className="text-xs text-muted-foreground">SKU: {currentVariation.sku}</span>
                )}
              </div>

              {stock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-accent-foreground">Quantity:</span>
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity === 1}
                      className="p-2 h-9.5 bg-muted  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4 text-accent-foreground" />
                    </Button>
                    <span className="px-6 py-2 font-semibold text-accent-foreground">{quantity}</span>
                    <Button
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                      disabled={quantity >= stock}
                      className="p-2 h-9.5 bg-muted  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={quantity >= stock ? `Maximum ${stock} available` : ''}
                    >
                      <Plus className="w-4 h-4 text-accent-foreground" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted">Max: {stock}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4">
              <div className='grid grid-cols-2 gap-3'>
              <Button
                onClick={() => handleAddToCart('order')}
                disabled={stock === 0 || !areAllAttributesSelected()}
                title={!areAllAttributesSelected() ? 'Please select all attributes' : stock === 0 ? 'Out of stock' : ''}
                className="w-full h-12 text-base font-semibold  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Handbag  className="w-5 h-5 mr-2"/>
                Order Now
              </Button>
              <Button
              variant={'outline'}
                onClick={() => handleAddToCart('cart')}
                disabled={stock === 0 || !areAllAttributesSelected()}
                title={!areAllAttributesSelected() ? 'Please select all attributes' : stock === 0 ? 'Out of stock' : ''}
                className="w-full h-12 text-base font-semibold  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              </div>
              <Button
                variant="outline"
                className="w-full h-12 text-base font-semibold border-slate-300"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Product
              </Button>
            </div>

            <div className=" border rounded-xl overflow-hidden bg-background">
              <div className="px-4 py-3 border-b bg-muted/50">
                <h3 className="text-sm font-semibold text-accent-foreground">
                  Shipping Zones
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">
                        Area
                      </th>
                      <th className="text-right px-4 py-2 font-medium text-muted-foreground">
                        Charge
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {appSetting?.shipping?.shippingZones?.map((zone, i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2 text-accent-foreground">
                          {zone.areaName}
                        </td>

                        <td className="px-4 py-2 text-right font-medium text-accent-foreground">
                          {zone.fee === 0
                            ? (
                              <span className="text-green-600 font-semibold">
                                Free
                              </span>
                            )
                            : (
                              `${CURRENCY} ${zone.fee.toLocaleString()}`
                            )}
                        </td>
                      </tr>
                    ))}

                    {!appSetting?.shipping?.shippingZones?.length && (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-6 text-center text-muted-foreground"
                        >
                          No shipping zones available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}