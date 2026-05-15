import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'
import React from 'react'
import AllUsers from './components/AllUsers'

const Brands = () => {
  return (
      <>
          <Navbar fixed></Navbar>
          <Main>
            <AllUsers />
          </Main>
        </>
  )
}

export default Brands