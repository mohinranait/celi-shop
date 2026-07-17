
import { ProductDetailss } from './components/product-details2';
import { IProduct, IProductDetailsResponse } from '@/redux/service/products/type';
import { fetchData } from '@/lib/fetch-data';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/envSecret';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const data = await fetchData<IProductDetailsResponse>({
    api: `client/products/${slug}`,
  });

  const product = data?.data as IProduct;
  

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const image = product?.gallery[0] ||'';

  const title = product?.seo?.title || product?.name;
  const description = product?.seo?.description || product?.shortDescription ||"";

  return {
    title,
    description,
    keywords: product?.tags.join(',') || '',

    alternates: {
      canonical: `${BASE_URL}/${slug}`,
    },

    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${slug}`,
      type: "website",

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product?.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const data = await fetchData<IProductDetailsResponse>({
    api: `client/products/${slug}`,
    // revalidate: 3600,
     revalidate: 0,
  });

  const product = data?.data as IProduct;

  if (!product) return;
  return (
    <div>
      <ProductDetailss product={product} />
      {/* <ProductDetails1 product={data?.data} /> */}
    </div>
  )
}

export default ProductDetails