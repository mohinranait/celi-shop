
import { Navbar } from "@/components/shared/NavBar";
import OrderComponent from "../components/OrderComponent";
import { Main } from "@/components/ui/main";

const OrderDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <>
    <Navbar />
    <Main>
      <OrderComponent orderId={id} />
    </Main>
  </>;
};

export default OrderDetailsPage;