
import ProductList from "./ProductList";
import { IProductListResponse } from "@/redux/service/products/type";
import { fetchData } from "@/lib/fetch-data";


const FeatureProducts = async () => {

  const getProducts = await fetchData<IProductListResponse>({
    api: `client/products?page=1&limit=10&type=featured`,
    revalidate: 1000,
  }, 1);

  const products = getProducts?.data;

  return <ProductList products={products} />
};

export default FeatureProducts;
