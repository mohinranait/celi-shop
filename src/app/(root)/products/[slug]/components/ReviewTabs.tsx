'use client';
import ViewHTML from "@/components/shared/html-viewer/HTMLView";
import StarRating from "@/components/shared/StarRating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetCommentByProductIdQuery } from "@/redux/service/comments";
import { IProduct } from "@/redux/service/products/type";
import { useGetAppSettingQuery } from "@/redux/service/setting";
import { formatDistanceToNow } from "date-fns";
import { VerifiedIcon } from "lucide-react";

type Props = {
  product: IProduct;
}
const ReviewTabs = ({ product }: Props) => {
  const { data: appSetting } = useGetAppSettingQuery()
  const { data: getComments } = useGetCommentByProductIdQuery({ productId: product?._id || '1', params: `accessMode=public` }, { skip: !product?._id })
  const reviews = getComments?.data || [];

  const avgRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews?.length ||
    0;

  const ratings = [1, 2, 3, 4, 5]
    .map((star) => {
      const totalReviews =
        reviews?.filter((st) => st.rating === star).length || 0;
      return {
        label: star,
        width: reviews?.length > 0 ? (totalReviews / reviews?.length) * 100 : 0,
        reviews: totalReviews,
      };
    })
    ?.reverse();


  // revalidate date function formate
  const formateDateRevalidate = (date: string) => {
    const formate = new Date(date);
    return formatDistanceToNow(formate, { addSuffix: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="col-span-4 lg:col-span-3 p-4 bg-white rounded-xl border">
        <Tabs defaultValue="details" className="gap-0 ">
          <TabsList className=" min-h-10 w-full flex justify-center  ">
            <TabsTrigger
              value="details"
              className="w-full py-4   bg-main-light text-main data-[state=active]:bg-main data-[state=active]:text-black"
            >
              Product Details
            </TabsTrigger>

            {
              appSetting?.features?.review &&
              <TabsTrigger
                value="reviews"
                className="w-full py-4   bg-main-light text-main data-[state=active]:bg-main data-[state=active]:text-black"
              >
                Reviews ({reviews?.length || 0})
              </TabsTrigger>
            }
          </TabsList>
          <TabsContent value="details" className="mt-0">
            <div className="bg-white col-span-2 px-5 py-4">
              <p className="font-semibold text-lg mb-2 text-gray-900">
                Product details of {product?.name}
              </p>

              <ViewHTML htmlText={product?.description || ''} />
        
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <div className="col-span-2 bg-white py-4">
              <p className=" text-sm font-semibold text-gray-700 px-5  ">
                Ratings & Reviews of {product?.name}
              </p>
              <div className="md:grid grid-cols-3 pb-5 gap-5  py-4 lg:px-5">
                <div className=" space-y-2 mb-6 lg:mb-0">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">
                      {avgRating?.toFixed(1) || 0}/
                      <span className="text-2xl">5</span>
                    </span>{" "}
                    <span className="text-white text-nowrap bg-[#FD8C00] text-xs py-1 px-3">
                      {avgRating >= 4
                        ? "Top Rated"
                        : avgRating >= 3
                          ? "Excellent"
                          : avgRating >= 2
                            ? "Good"
                            : "Poor"}
                    </span>{" "}
                  </div>
                  <div className="flex items-center gap-2">
                    {" "}
                    <StarRating value={avgRating} />
                  </div>
                  <p className="text-gray500 text-xs font-medium text-gray-600">
                    {reviews?.length || 0} Ratings
                  </p>
                </div>
                <div className="col-span-2">
                  <ul className="space-y-1">
                    {ratings?.map((star, i) => (
                      <li key={i} className="flex gap-5 items-center">
                        <div className=" gap-2 w-25 ">
                          <StarRating value={5 - i} />
                        </div>

                        <span className="w-30 sm:w-50 h-2  bg-[#E5E5E5] inline-block relative">
                          <span
                            className="bg-[#FD8C00] absolute left-0 top-0 inline-block h-2"
                            style={{ width: `${star?.width}%` }}
                          ></span>
                        </span>
                        <span className="text-sm text-gray-700">
                          {star?.reviews}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-white text-sm text-gray-700 px-5 py-3 border-y border-gray-100 ">
                Product Reviews
              </div>
              <ul className="bg-white divide-y divide-gray-100">
                {reviews?.map((review, index) => (
                  <li className="py-3 lg:px-5" key={index}>
                    <div className="mb-2">
                      <StarRating size={12} value={review?.rating} />
                      <div className="flex justify-between items-center">
                        <p className="flex items-center gap-1 text-sm text-gray-600">
                          <span className="text-gray-800">
                            {review?.userId?.name}{" "}
                          </span>
                          <VerifiedIcon className="text-main" size={14} />
                        </p>
                        <p className="text-sm text-gray-500">
                          {formateDateRevalidate(review?.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {review?.comment}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div></div>
    </div>
  )
}

export default ReviewTabs