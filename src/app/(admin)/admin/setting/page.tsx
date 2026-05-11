import React, { Suspense } from 'react'
import SettingsComponent from './components/SettingComponent'
import { Navbar } from '@/components/shared/NavBar'
import { Main } from '@/components/ui/main'

const SettingPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar fixed />
      <Main>
        <SettingsComponent />
      </Main>

    </Suspense>
  )
}

export default SettingPage