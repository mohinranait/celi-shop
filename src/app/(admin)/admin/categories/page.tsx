import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'
import React from 'react'
import AllCategories from './components/AllCategories'

const Brands = () => {
  return (
      <>
          <Navbar fixed></Navbar>
          <Main>
            <AllCategories />
          </Main>
        </>
  )
}

export default Brands