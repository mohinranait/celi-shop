import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'
import React from 'react'
import AllComments from './components/AllComments'

const CommentPage = () => {
  return (
      <>
          <Navbar fixed></Navbar>
          <Main>
            <AllComments />
          </Main>
        </>
  )
}

export default CommentPage