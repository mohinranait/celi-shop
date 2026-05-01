import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'
import React from 'react'
import MediaRootComponent from './components/MediaRootComponent'

const MediaPage = () => {
  return (
     <>
          <Navbar fixed></Navbar>
          <Main>
            <MediaRootComponent />
          </Main>
        </>
  )
}

export default MediaPage