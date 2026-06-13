
import { fetchData } from "@/lib/fetch-data";
import { IProductListResponse } from "@/redux/service/products/type";
import ProductList from "./ProductList";


const TopSelling = async () => {

  const getProducts = await fetchData<IProductListResponse>({
    api: `client/products?page=1&limit=10&type=bestselling`,
    revalidate: 1000,
  }, 1);

  const products = getProducts?.data;

  return <ProductList products={products} />
};

export default TopSelling;
