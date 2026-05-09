
import { Navbar } from '@/components/shared/NavBar';
import { Main } from '@/components/ui/main';
import AllOrders from './components/AllOrders';

const AllProductsPage = () => {


  return (
    <>
    <Navbar />
    <Main>
    <AllOrders />
    </Main>
    </>
  )
}

export default AllProductsPage