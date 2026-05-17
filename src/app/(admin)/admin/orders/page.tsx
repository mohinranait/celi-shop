
import { Navbar } from '@/components/shared/NavBar';
import { Main } from '@/components/ui/main';
import AllOrders from './components/AllOrders';

const AllProductsPage = () => {


  return (
    <>
      <Navbar fixed />
      <Main>
        <AllOrders />
      </Main>
    </>
  )
}

export default AllProductsPage