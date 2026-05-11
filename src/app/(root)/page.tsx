import React from 'react'
import HeroSection from './components/hero-area'
import Categories from './components/categories'
import HomeProducts from './components/products-home'
import SliderCategories from './components/SliderCategories'

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <SliderCategories /> 
      <Categories />
      <HomeProducts />
    </div>
  )
}

export default HomePage