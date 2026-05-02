import React from 'react'
import ProductForm from './components/ProductForm'
import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'

const ProductFormPage = () => {
  return (
    <>
    <Navbar fixed />
    <Main>
      <ProductForm />
    </Main>
    </>
  )
}

export default ProductFormPage