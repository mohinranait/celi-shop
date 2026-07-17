'use client'
import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'
import AddProductForm from '../form/components/ProductForm'
import { useSearchParams } from 'next/navigation'

const ProductEditPage = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get('pid');
  return (
    <>
    <Navbar fixed />
    <Main>
      <AddProductForm />
    </Main>
    </>
  )
}

export default ProductEditPage