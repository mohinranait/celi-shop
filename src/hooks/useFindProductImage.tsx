import { PRODUCT_IMG } from '@/lib/default-import';
import { IProduct } from '@/redux/service/products/type';

const findProductImage = ({ product }: { product: IProduct }) => {
  const { gallery, variations, } = product || {};


  // 1. Gallery image first
  if (gallery?.length && gallery[0]) {
    return gallery[0];
  }

  // 2. Variant image
  if (variations?.length) {
    const variantWithImage = variations.find(
      (variant) => variant?.images?.length && variant.images[0]
    );

    if (variantWithImage?.images?.[0]) {
      return variantWithImage.images[0];
    }
  }

  // 3. Default image
  return `/${PRODUCT_IMG}`;

}

export default findProductImage