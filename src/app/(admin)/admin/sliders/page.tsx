import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'
import AllSliders from './components/AllSliders'

const SlidersPage = () => {
  return (
      <>
          <Navbar fixed></Navbar>
          <Main>
            <AllSliders />
          </Main>
        </>
  )
}

export default SlidersPage