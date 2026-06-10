
import OrderDetailsComponent from "./components/OrderDetailsComponent";

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  // Order UID
  const { orderId } = await params;

  return <OrderDetailsComponent orderId={orderId} />;
};

export default OrderDetailsPage;
