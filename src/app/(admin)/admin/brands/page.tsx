import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'
import React from 'react'
import AllBrands from './components/AllBrands'

const Brands = () => {
  return (
      <>
          <Navbar fixed></Navbar>
          <Main>
            <AllBrands />
          </Main>
        </>
  )
}

export default Brands