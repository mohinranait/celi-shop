

import ProductList from './ProductList';
import { fetchData } from '@/lib/fetch-data';
import { IProductListResponse } from '@/redux/service/products/type';

const OfferProducts = async () => {
  const getProducts = await fetchData<IProductListResponse>({
    api: `client/products?page=1&limit=10&type=offer`,
    revalidate: 1000,
  }, 1);

  const newProducts = getProducts?.data;

  return <ProductList products={newProducts} />
}

export default OfferProducts