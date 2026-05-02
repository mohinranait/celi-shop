import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'
import React from 'react'
import AllAttributes from './components/AllAttributes'

const Brands = () => {
  return (
      <>
          <Navbar fixed></Navbar>
          <Main>
            <AllAttributes />
          </Main>
        </>
  )
}

export default Brands