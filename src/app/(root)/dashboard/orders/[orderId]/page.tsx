
import React from "react";
import OrderDetailsComponent from "./components/OrderDetailsComponent";

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  // Order UID
  const {orderId} = await params;

  console.log({orderId});
  



  return <OrderDetailsComponent orderId={orderId} />;
};

export default OrderDetailsPage;
