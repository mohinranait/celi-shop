
import { Navbar } from '@/components/shared/NavBar';
import AllProducts from './components/AllProducts';
import { Main } from '@/components/ui/main';

const AllProductsPage = () => {


  return (
    <>
    <Navbar />
    <Main>
    <AllProducts />
    </Main>
    </>
  )
}

export default AllProductsPage