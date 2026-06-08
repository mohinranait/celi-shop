import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'
import AllRequestQuotes from './components/AllRequestQuote'

const RequestQuotePage = () => {
  return (
    <>
      <Navbar fixed></Navbar>
      <Main>
        <AllRequestQuotes />
      </Main>
    </>
  )
}

export default RequestQuotePage