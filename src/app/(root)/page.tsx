import React from 'react'
import HeroSection from './components/hero-area'
import Categories from './components/categories'
import HomeProducts from './components/products-home'

const HomePage = () => {
  return (
    <div>
      <HeroSection /> 
      <Categories />
      <HomeProducts />
    </div>
  )
}

export default HomePage