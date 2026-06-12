import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'
import AllContactQuery from './components/AllContactQuery'

const ContactQuery = () => {
  return (
      <>
          <Navbar fixed></Navbar>
          <Main>
            <AllContactQuery />
          </Main>
        </>
  )
}

export default ContactQuery