
import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'
import DashboardComponent from './components/DashboardComponent';

const AdminDashboard = () => {


  return (
    <>
      <Navbar fixed></Navbar>
      <Main>
        <DashboardComponent />
      </Main>
    </>
  )
}

export default AdminDashboard





