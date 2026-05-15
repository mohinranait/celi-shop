import React from 'react'
import UpdateComponent from './components/UpdateComponent'
import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'

const UpdateProfilePage = async ({ params }: { params: Promise< { id: string }> }) => {
  const {id} = await params;
  return (

    <>
      <Navbar fixed></Navbar>
      <Main>
        <UpdateComponent userId={id} />
      </Main>
    </>


  )
}

export default UpdateProfilePage