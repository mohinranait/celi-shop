import ProductList from '@/app/(root)/components/ProductList';
import { fetchData } from '@/lib/fetch-data';
import { IProductListResponse } from '@/redux/service/products/type';


const RelatedProducts = async ({ catId }: { catId: string }) => {
  const getReletedProducts = await fetchData<IProductListResponse>({
    api: `client/products?page=1&limit=8&type=related&category=${catId}`,
    revalidate: 1000,
  }, 1);

  const reletedProducts = getReletedProducts?.data;

  return (
    <ProductList products={reletedProducts} />
  )
}

export default RelatedProducts